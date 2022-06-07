class Overworld {

    constructor(config) {
        this.element = config.element; // passing elemnt for the overworld to work on
        this.canvas = this.element.querySelector(".game-canvas"); // calling canvas tag
        this.ctx = this.canvas.getContext("2d"); // gets us assets to all the drawing method present in canvas
        this.map = null;
    }

    //refresh the screen every second
    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the frame everytime it loads

            //Camara following the main character

            const cameraPerson = this.map.gameObjects.hero;


            // upadte all objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.drectionInput.direction,
                    map: this.map,
                })
            })



            //draw lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //draw game Objects

            //sorting to display the correct sprite and draw them
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y; // substracting the y value to display the correct sprite
            }).forEach(object => {

                object.sprite.draw(this.ctx, cameraPerson);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            //console.log("refresh");
            requestAnimationFrame(() => {
                step(); //calls step() when new frame starts 
            })
        }
        step();
    }

    // check if he is talking to NPCs
    bindActionInput() {
        new keyPressListener("Enter", () => {

            //Is there a person to talk to???
            this.map.checkForActionCutscene()
        })
    }


    //check for heros positions
    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                // heros positon has changed

                this.map.checkForFootstepCutscene()
            }
        })
    }


    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig); // loading map
        this.map.overworld = this;
        this.map.mountObjects();
    }

    main() {
        this.startMap(window.OverworldMaps.DemoRoom);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.drectionInput = new DirectionInput();
        this.drectionInput.main();

        this.startGameLoop(); // starts this loop when the game starts

        this.map.startCutscene([


            // { type: "battle" , enemyId:"beth" },
            // { type: "changeMap", map: "DemoRoom" },

            //  setting up event when cutscene triggers

            // { who: "hero", type: "walk", direction: "down" },
            // { who: "hero", type: "walk", direction: "down" },
            // { who: "npcA", type: "walk", direction: "left" },
            // { who: "npcA", type: "walk", direction: "up" },
            // { who: "npcA", type: "stand", direction: "left", time: 200 },
            // { who: "hero", type: "stand", direction: "right", time: 200 },
            // { type: "textMessage", text: " HELLO HOW ARE YOU !" },
        ])


    }












}