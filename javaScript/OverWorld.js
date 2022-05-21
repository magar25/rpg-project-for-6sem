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
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y; // to display the sprite correctly if infront characters
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

    main() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom); // loading map
        this.map.mountObjects();

        this.drectionInput = new DirectionInput();
        this.drectionInput.main();

        this.startGameLoop(); // starts this loop when the game starts

        // this.map.startCutscene([

        //     //  { type: "textMessage", text: "WHY HELLO THERE!" },

        //     //  setting up event when cutscene triggers

        //     { who: "hero", type: "walk", direction: "down" },
        //     { who: "hero", type: "walk", direction: "down" },
        //     { who: "npcA", type: "walk", direction: "left" },
        //     { who: "npcA", type: "walk", direction: "left" },
        //     { who: "npcA", type: "walk", direction: "up", time: 800 },
        // ])


    }












}