

class Sprite{
    constructor(config){

        //setting the image
        this.image= new Image();
        this.image.src = config.src;
        this.image.onload=()=>{
            this.isLoaded = true; // will draw the image only if the value is true
        }


        //shadow
        this.shadow= new Image();
        this.useShadow=true;// config.useShadow || false
        if(this.useShadow){
            this.shadow.src ="/images/characters/shadow.png"; // use shadow only if the value is true
        }
        this.shadow.onload= () =>{
            this.isShadowLoaded= true;
        }
        


        //Configuring animation and initial state
        this.animations = config.animations || {
            idleDown:[
                [0,0] //defaut animations
            ]
        }
        this.currentAnimation=config.currentAnimation || "idleDown";
        this.currentAnimationFrame=0;


        //refrence the game object
        this.gameObject = config.gameObject;
    }

    draw(ctx){
        const x =this.gameObject.x-8; //each square is 16*16
        const y =this.gameObject.y-18; //each square is 16*16

        this.isShadowLoaded && ctx.drawImage(this.shadow,x,y);

        this.isLoaded &&  ctx.drawImage(this.image,
            0,0, // left and right cut
            32,32, // size of the cut
            x,y,
            32,32 // size of which it should be drawn
            )
    }
}