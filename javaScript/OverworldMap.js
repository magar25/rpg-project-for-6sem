class OverworldMap {
    constructor(config) {

        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {}; // object for walls

        this.lowerImage = new Image(); // for images like floor, road ,grass etc
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image(); // for images like roof, treetop etc
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false; // for cutscenes


    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    isSpaceTaken(currentX, currentY, direction) { //to check if we are aginst some kind of wall
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key; // calls id as in hero, NPCs etc...

            //todo: if this object is to mount or not
            object.mount(this);
        })
    }

    // Cut scene events
    async startCutscene(events) { // async executes the behaviour 1 by 1

        this.isCutscenePlaying = true; // true to play events

        //for events to play in order

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.main(); //wait for each event to complete
        }

        this.isCutscenePlaying = false;


        // reset NPC to do their idle behavior

        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    // check for action
    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        //to see heroes position and where he is facing
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);

        //to check if the hero is interaction with the person or not
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        console.log({ match });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events) // defaulting to the first one we find
        }
    }

    // check for heor's footsteps

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events) //defaulting to the first one we find
        }
    }



    addWall(x, y) { // adding invisible wall
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y) { // removing invisible wall
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }

}


window.OverworldMaps = { //object of all the maps in the game

    DemoRoom: {
        lowerSrc: "/images/maps/DemoLower.png",
        upperSrc: "/images/maps/DemoUpper.png",

        gameObjects: {

            hero: new Person({
                isPlayerControlled: true, // it is true cause we can control this unit
                x: utils.withGrid(5),
                y: utils.withGrid(6),
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "/images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800 },
                    { type: "stand", direction: "up", time: 1000 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300 },
                ],
                talking: [{
                        events: [

                            { type: "textMessage", text: " I'm busy.... !", faceHero: "npcA" },
                            { type: "battle" , enemyId:"beth" },
                           { type: "textMessage", text: " Go away !" },
                            // { who: "hero", type: "walk", direction: "up" }
                        ]
                    },
                    // {
                    //     events: [
                    //         { type: "textMessage", text: " how are you !" }
                    //     ]
                    // }
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "/images/characters/people/erio.png",
                talking:[
                    {
                        events:[
                            { type: "textMessage", text: "Bahahahah...!", faceHero: "npcB" },
                            { type: "battle" , enemyId:"erio" },
                        ]
                    }
                ]
            //     behaviorLoop: [
            //         { type: "stand", direction: "right", time: 1000 },
            //         { type: "stand", direction: "down", time: 800 },
            //         { type: "stand", direction: "left", time: 1200 },
            //         { type: "stand", direction: "down", time: 1500 },

            //     ]
             }),

        },
        walls: {
            [utils.asGridCoord(7, 6)]: true,
            [utils.asGridCoord(8, 6)]: true,
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(8, 7)]: true,
        },

        //trigger the following cutscene if hero walk in certain coorindate 
        cutsceneSpaces: {
            [utils.asGridCoord(7, 4)]: [{
                events: [
                    { who: "npcB", type: "walk", direction: "left" },
                    { who: "npcB", type: "stand", direction: "up", time: 500 },
                    { type: "textMessage", text: "you can't go in there !!!!" },
                    { who: "npcB", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "left" },
                ]
            }],
            [utils.asGridCoord(5, 10)]: [{
                events: [
                    { type: "changeMap", map: "Kitchen" },
                ]
            }]
        }
    },
    Kitchen: {
        lowerSrc: "/images/maps/KitchenLower.png",
        upperSrc: "/images/maps/KitchenUpper.png",

        gameObjects: {

            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            }),
            npcA: new Person({
                x: utils.withGrid(9),
                y: utils.withGrid(6),
                src: "/images/characters/people/npc2.png",
                talking: [{
                        events: [
                            { type: "textMessage", text: "Just in time !", faceHero: "npcA" },
                        ]
                    }

                ]
            }),
            npcB: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "/images/characters/people/npc3.png"

            }),

        }
    },


}