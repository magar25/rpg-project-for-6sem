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
        this.isPaused=false;


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
           const result = await eventHandler.main(); //wait for each event to complete
           if(result ==="LOST_BATTLE"){
               break; // if the player looses the battle the cutscene breaks and wont move faward
           }
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
      //  console.log({ match });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            const relevantScenario = match.talking.find(scenario =>{
                return(scenario.required || []).every(sf=>{
                    return playerState.storyFlags[sf]
                })
            })
            
           relevantScenario && this.startCutscene(relevantScenario.events) // defaulting to the first one we find
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

    //DemoRoom
    DemoRoom: {
        id:"DemoRoom",
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
                talking: [
                    {
                        required :["TALKED_TO_ERIO"],
                        events: [
                            { type: "textMessage", text: " Isn't Erio the coolest? !", faceHero :"npcA" },
                        ]
                    },
                    {
                    
                        events: [

                            { type: "textMessage", text: " I am going to cruch you !!!", faceHero: "npcA" },
                            { type: "battle" , enemyId:"beth" },
                            { type: "addStoryFlag", flag: "DEFEATED_BETH" },
                            { type: "textMessage", text: " I was sure I was gonna win !!!", faceHero: "npcA" },
                          // { type: "textMessage", text: " Go away !" },
                            // { who: "hero", type: "walk", direction: "up" }
                        ]
                    },
                   
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
                            { type: "addStoryFlag", flag: "TALKED_TO_ERIO" },
                          //  { type: "battle" , enemyId:"erio" },
                        ]
                    }
                ],
                behaviorLoop: [
                    { type: "stand", direction: "right", time: 1000 },
                    { type: "stand", direction: "down", time: 800 },
                    { type: "stand", direction: "left", time: 1200 },
                    { type: "stand", direction: "down", time: 1500 },

                ]
             }),
             pizzaStone: new PizzaStone({
                x: utils.withGrid(2),
                y: utils.withGrid(7),
                storyFlag: "USED_PIZZA_STONE",
                pizzas: ["v001", "f001","c001"],
              }),
        },
        walls: {
            //for table
            [utils.asGridCoord(7, 6)]: true,
            [utils.asGridCoord(8, 6)]: true,
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(8, 7)]: true,
            //buttom wall
            [utils.asGridCoord(10,10)]: true,
            [utils.asGridCoord(9, 10)]: true,
            [utils.asGridCoord(8, 10)]: true,
            [utils.asGridCoord(7, 10)]: true,
            [utils.asGridCoord(6, 10)]: true,
            [utils.asGridCoord(5, 11)]: true,
            [utils.asGridCoord(4, 10)]: true,
            [utils.asGridCoord(3, 10)]: true,
            [utils.asGridCoord(2, 10)]: true,
            [utils.asGridCoord(1, 10)]: true,
            //right wall
            [utils.asGridCoord(11, 9)]: true,
            [utils.asGridCoord(11, 8)]: true,
            [utils.asGridCoord(11, 7)]: true,
            [utils.asGridCoord(11, 6)]: true,
            [utils.asGridCoord(11, 5)]: true,
            [utils.asGridCoord(11, 4)]: true,
            //top wall
            [utils.asGridCoord(10, 3)]: true,
            [utils.asGridCoord(9, 3)]: true,
            [utils.asGridCoord(8, 4)]: true,
            [utils.asGridCoord(7, 3)]: true,
            [utils.asGridCoord(6, 4)]: true,
            [utils.asGridCoord(5, 3)]: true,
            [utils.asGridCoord(4, 3)]: true,
            [utils.asGridCoord(3, 3)]: true,
            [utils.asGridCoord(2, 3)]: true,
            [utils.asGridCoord(1, 3)]: true,
            //left wall
            [utils.asGridCoord(0, 9)]: true,
            [utils.asGridCoord(0, 8)]: true,
            [utils.asGridCoord(0, 7)]: true,
            [utils.asGridCoord(0, 6)]: true,
            [utils.asGridCoord(0, 5)]: true,
            [utils.asGridCoord(0, 4)]: true,    
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
                    { type: "changeMap", 
                    map: "Street",
                    x: utils.withGrid(5),
                    y: utils.withGrid(9),
                    direction:"down"
                },
                ]
            }]
        }
    },

    //Kitchen
    Kitchen: {
        id:"Kitchen",
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

        },
        
        walls: {
            //for table
        
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(6, 7)]: true,
            [utils.asGridCoord(9, 7)]: true,
            [utils.asGridCoord(10, 7)]: true,
            [utils.asGridCoord(9, 9)]: true,
            [utils.asGridCoord(10, 9)]: true,
            //buttom wall
            [utils.asGridCoord(12,10)]: true,
            [utils.asGridCoord(11,10)]: true,
            [utils.asGridCoord(10,10)]: true,
            [utils.asGridCoord(9, 10)]: true,
            [utils.asGridCoord(8, 10)]: true,
            [utils.asGridCoord(7, 10)]: true,
            [utils.asGridCoord(6, 10)]: true,
            [utils.asGridCoord(5, 11)]: true,
            [utils.asGridCoord(4, 10)]: true,
            [utils.asGridCoord(3, 10)]: true,
            [utils.asGridCoord(2, 9)]: true,
            [utils.asGridCoord(1, 9)]: true,
            //right wall
            [utils.asGridCoord(13, 9)]: true,
            [utils.asGridCoord(13, 8)]: true,
            [utils.asGridCoord(13, 7)]: true,
            [utils.asGridCoord(13, 6)]: true,
            [utils.asGridCoord(13, 5)]: true,
            [utils.asGridCoord(13, 4)]: true,
            //top wall
            [utils.asGridCoord(12, 4)]: true,
            [utils.asGridCoord(11, 4)]: true,
            [utils.asGridCoord(10, 3)]: true,
            [utils.asGridCoord(9, 3)]: true,
            [utils.asGridCoord(9, 3)]: true,
            [utils.asGridCoord(8, 3)]: true,
            [utils.asGridCoord(7, 3)]: true,
            [utils.asGridCoord(6, 3)]: true,
            [utils.asGridCoord(5, 3)]: true,
            [utils.asGridCoord(4, 3)]: true,
            [utils.asGridCoord(3, 3)]: true,
            [utils.asGridCoord(2, 3)]: true,
            [utils.asGridCoord(1, 3)]: true,
        
            //left wall
            [utils.asGridCoord(0, 9)]: true,
            [utils.asGridCoord(0, 8)]: true,
            [utils.asGridCoord(1, 7)]: true,
            [utils.asGridCoord(1, 6)]: true,
            [utils.asGridCoord(1, 5)]: true,
            [utils.asGridCoord(0, 4)]: true,
            
           
        },
              //trigger the following cutscene if hero walk in certain coorindate 
              cutsceneSpaces: {
        
                [utils.asGridCoord(5, 10)]: [{
                    events: [
                        { type: "changeMap",
                         map: "Street",
                        x: utils.withGrid(29),
                        y: utils.withGrid(9),
                        direction:"down"
                    },
                    ]
                }]
            
    
        },
    },

     //Street
     Street: {
         id:"Street",
        lowerSrc: "/images/maps/StreetLower.png",
        upperSrc: "/images/maps/StreetUpper.png",
        gameObjects: {

            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(30),
                y: utils.withGrid(10),
            }),
        },
        walls: {
            //for garden
            [utils.asGridCoord(18, 11)]: true,
            [utils.asGridCoord(19, 11)]: true,
            [utils.asGridCoord(17, 11)]: true,
            [utils.asGridCoord(17, 10)]: true,
            [utils.asGridCoord(17, 9)]: true,
            [utils.asGridCoord(16, 11)]: true,
            [utils.asGridCoord(16, 10)]: true,
            [utils.asGridCoord(16, 9)]: true,
            [utils.asGridCoord(25, 11)]: true,
            [utils.asGridCoord(25, 10)]: true,
            [utils.asGridCoord(25, 9)]: true,
            [utils.asGridCoord(26, 11)]: true,
            [utils.asGridCoord(26, 10)]: true,
            [utils.asGridCoord(26, 9)]: true,
            //buttom wall
            [utils.asGridCoord(33,14)]: true,
            [utils.asGridCoord(32, 14)]: true,
            [utils.asGridCoord(31, 14)]: true,
            [utils.asGridCoord(30, 14)]: true,
            [utils.asGridCoord(29, 14)]: true,
            [utils.asGridCoord(28, 14)]: true,
            [utils.asGridCoord(27, 14)]: true,
            [utils.asGridCoord(26, 14)]: true,
            [utils.asGridCoord(25, 14)]: true,
            [utils.asGridCoord(24, 14)]: true,
            [utils.asGridCoord(23, 14)]: true,
            [utils.asGridCoord(22, 14)]: true,
            [utils.asGridCoord(21, 14)]: true,
            [utils.asGridCoord(20, 14)]: true,
            [utils.asGridCoord(19, 14)]: true,
            [utils.asGridCoord(18, 14)]: true,
            [utils.asGridCoord(17, 14)]: true,
            [utils.asGridCoord(16, 14)]: true,
            [utils.asGridCoord(15, 14)]: true,
            [utils.asGridCoord(14, 14)]: true,
            [utils.asGridCoord(13, 14)]: true,
            [utils.asGridCoord(12, 14)]: true,
            [utils.asGridCoord(11, 14)]: true,
            [utils.asGridCoord(10, 14)]: true,
            [utils.asGridCoord(9, 14)]: true,
            [utils.asGridCoord(8, 14)]: true,
            [utils.asGridCoord(7, 14)]: true,
            [utils.asGridCoord(6, 14)]: true,
            [utils.asGridCoord(5, 14)]: true,
            [utils.asGridCoord(4, 14)]: true,
           
            //right wall
            [utils.asGridCoord(34,13)]: true,
            [utils.asGridCoord(34,12)]: true,
            [utils.asGridCoord(34,11)]: true,
            [utils.asGridCoord(34,10)]: true,

            //top wall
            [utils.asGridCoord(33,9)]: true,
            [utils.asGridCoord(32,9)]: true,
            [utils.asGridCoord(31,9)]: true,
            [utils.asGridCoord(30,9)]: true,
            [utils.asGridCoord(29,8)]: true,
            [utils.asGridCoord(28,9)]: true, //door co-ordinate
            [utils.asGridCoord(28,8)]: true,
            [utils.asGridCoord(27,7)]: true,
            [utils.asGridCoord(26,7)]: true,
            [utils.asGridCoord(26,6)]: true,
            [utils.asGridCoord(26,5)]: true,
            [utils.asGridCoord(25,4)]: true,
            [utils.asGridCoord(24,5)]: true,
            [utils.asGridCoord(24,6)]: true,
            [utils.asGridCoord(24,7)]: true,
            [utils.asGridCoord(23,7)]: true, 
            [utils.asGridCoord(22,7)]: true,
            [utils.asGridCoord(21,7)]: true,
            [utils.asGridCoord(20,7)]: true,
            [utils.asGridCoord(19,7)]: true,
            [utils.asGridCoord(18,7)]: true,
            [utils.asGridCoord(17,7)]: true,
            [utils.asGridCoord(16,7)]: true,
            [utils.asGridCoord(15,7)]: true,
            [utils.asGridCoord(14,8)]: true,
            [utils.asGridCoord(13,8)]: true,
            [utils.asGridCoord(12,9)]: true,
            [utils.asGridCoord(11,9)]: true,
            [utils.asGridCoord(10,9)]: true,
            [utils.asGridCoord(9,9)]: true,
            [utils.asGridCoord(8,9)]: true,
            [utils.asGridCoord(7,9)]: true,
            [utils.asGridCoord(6,9)]: true,
            [utils.asGridCoord(5,8)]: true,//door co-ordinate
            [utils.asGridCoord(4,9)]: true,

            //left wall
            [utils.asGridCoord(3, 10)]: true,
            [utils.asGridCoord(3, 11)]: true,
            [utils.asGridCoord(3, 12)]: true,
            [utils.asGridCoord(3, 13)]: true,
            [utils.asGridCoord(3, 14)]: true,
            [utils.asGridCoord(3, 15)]: true,    
        },
            
             //trigger the following cutscene if hero walk in certain coorindate 
        cutsceneSpaces: {
        
            [utils.asGridCoord(29, 9)]: [{
                events: [
                    { type: "changeMap",
                     map: "PizzaShop",
                    x: utils.withGrid(5),
                    y: utils.withGrid(12),
                    direction:"up"
                },
                ]
            }],
            [utils.asGridCoord(5,9)]: [{
                events: [
                    { type: "changeMap",
                     map: "DemoRoom",
                    x: utils.withGrid(5),
                    y: utils.withGrid(10),
                    direction:"up"
                },
                ]
            }],
            [utils.asGridCoord(25,5)]: [{
                events: [
                    { type: "changeMap",
                     map: "StreetNorth",
                    x: utils.withGrid(5),
                    y: utils.withGrid(12),
                    direction:"up"
                },
                ]
            }],
        

    },
    },

    //DiningRoom
    DiningRoom: {
        id:"DiningRoom",
        lowerSrc: "/images/maps/DiningRoomLower.png",
        upperSrc: "/images/maps/DiningRoomUpper.png",
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
    //GreenKitchen
    GreenKitchen: {
        id:"GreenKitchen",
        lowerSrc: "/images/maps/GreenKitchenLower.png",
        upperSrc: "/images/maps/GreenKitchenUpper.png",
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

    //PizzaShop
    PizzaShop: {
        id:"PizzaShop",
        lowerSrc: "/images/maps/PizzaShopLower.png",
        upperSrc: "/images/maps/PizzaShopUpper.png",
        gameObjects: {

            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            }),
   
    },
    walls: {
        //for table
        [utils.asGridCoord(3, 10)]: true,
        [utils.asGridCoord(3, 9)]: true,
        [utils.asGridCoord(3, 8)]: true,
        [utils.asGridCoord(4, 10)]: true,
        [utils.asGridCoord(4, 9)]: true,
        [utils.asGridCoord(4, 8)]: true,
        [utils.asGridCoord(7, 9)]: true,
        [utils.asGridCoord(7, 8)]: true,
        [utils.asGridCoord(8, 9)]: true,
        [utils.asGridCoord(8, 8)]: true,

        //for counter
        [utils.asGridCoord(9, 4)]: true,
        [utils.asGridCoord(9, 5)]: true,
        [utils.asGridCoord(9, 6)]: true,
        [utils.asGridCoord(8, 6)]: true,
        [utils.asGridCoord(7, 6)]: true,
        [utils.asGridCoord(5, 6)]: true,
        [utils.asGridCoord(4, 6)]: true,
        [utils.asGridCoord(3, 6)]: true,
        [utils.asGridCoord(2, 6)]: true,
        [utils.asGridCoord(2, 5)]: true,
        [utils.asGridCoord(2, 4)]: true,
        //buttom wall
        [utils.asGridCoord(10,12)]: true,
        [utils.asGridCoord(9, 12)]: true,
        [utils.asGridCoord(8, 12)]: true,
        [utils.asGridCoord(7, 12)]: true,
        [utils.asGridCoord(6, 12)]: true,
        [utils.asGridCoord(5, 13)]: true,
        [utils.asGridCoord(4, 12)]: true,
        [utils.asGridCoord(3, 12)]: true,
        [utils.asGridCoord(2, 12)]: true,
        [utils.asGridCoord(1, 12)]: true,
        //right wall
        [utils.asGridCoord(11, 12)]: true,
        [utils.asGridCoord(11, 11)]: true,
        [utils.asGridCoord(11, 10)]: true,
        [utils.asGridCoord(11, 9)]: true,
        [utils.asGridCoord(11, 8)]: true,
        [utils.asGridCoord(11, 7)]: true,
        [utils.asGridCoord(11, 6)]: true,
        [utils.asGridCoord(11, 5)]: true,
        [utils.asGridCoord(11, 4)]: true,
        //top wall
        [utils.asGridCoord(10, 3)]: true,
        [utils.asGridCoord(8, 3)]: true,
        [utils.asGridCoord(7, 3)]: true,
        [utils.asGridCoord(6, 3)]: true,
        [utils.asGridCoord(5, 3)]: true,
        [utils.asGridCoord(4, 3)]: true,
        [utils.asGridCoord(3, 3)]: true,
        [utils.asGridCoord(1, 3)]: true,
        //left wall
        [utils.asGridCoord(0, 11)]: true,
        [utils.asGridCoord(0, 10)]: true,
        [utils.asGridCoord(0, 9)]: true,
        [utils.asGridCoord(0, 8)]: true,
        [utils.asGridCoord(0, 7)]: true,
        [utils.asGridCoord(0, 6)]: true,
        [utils.asGridCoord(0, 5)]: true,
        [utils.asGridCoord(0, 4)]: true,    
    },
    cutsceneSpaces: {
    [utils.asGridCoord(5, 12)]: [{
        events: [
            { type: "changeMap",
             map: "Street",
            x: utils.withGrid(29),
            y: utils.withGrid(9),
            direction:"down"
        },
        ]
    }]
    },
    },

    //StreetNorth
    StreetNorth: {
        id:"StreetNorth",
        lowerSrc: "/images/maps/StreetNorthLower.png",
        upperSrc: "/images/maps/StreetNorthUpper.png",
        gameObjects: {

            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            }),

    },
    },









}