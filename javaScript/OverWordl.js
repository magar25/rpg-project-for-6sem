

class Overworld{

    constructor(config){
        this.element = config.element; // passing elemnt for the overworld to work on
        this.canvas = this.element.querySelector(".game-canvas"); // calling canvas tag
        this.ctx = this.canvas.getContext("2d"); // gets us assess to all the drawing method present in canvas
    
    }

    main(){
        console.log("hello form overworld",this);
        const image= new Image(); //creating new Image
        image.onload=() =>{
            this.ctx.drawImage(image,0,0) //puting the image in the canvas 
        };
        image.src="/images/maps/DemoLower.png"; // calling demolower image
        

        //Place some Game Object
        const hero = new GameObject({
            x:5,
            y:6,
        })

        const npc1 = new GameObject({
            x:7,
            y:9,
            src:"/images/characters/people/npc1.png"
        })
        
        setTimeout(()=> {
            hero.sprite.draw(this.ctx);
            npc1.sprite.draw(this.ctx);
        },200)
      

    }












}