

class Overworld{

    constructor(config){
        this.element = config.element; // passing elemnt for the overworld to work on
        this.canvas = this.element.querySelector(".game-canvas"); // calling canvas tag
        this.ctx = this.canvas.getContext("2d"); // gets us assess to all the drawing method present in canvas
        this.map=null;
    }
 
    //refresh the screen every second
    startGameLoop(){
        const step=()=>{
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); // clears the frame everytime it loads

            //draw lower layer
            this.map.drawLowerImage(this.ctx);

            //draw game Objects
            Object.values(this.map.gameObjects).forEach(object =>{
                object.update({
                    arrow: this.drectionInput.direction
                })
                object.sprite.draw(this.ctx);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx);

            //console.log("refresh");
            requestAnimationFrame(()=> {
                
                step(); //calls step() when new frame starts 
            })
        }
        step();
    }

    main(){
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);// loading map

        this.drectionInput = new DirectionInput();
        this.drectionInput.main();

        this.startGameLoop(); // starts this loop when the game starts
        


      

    }












}