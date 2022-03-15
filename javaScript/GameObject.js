

class GameObject{

    constructor(config){
        this.isMounted=false;
        this.x=config.x || 0; // starting position of a character in x axis
        this.y=config.y || 0; // starting position of a character in y axis
        this.direction= config.direction || "down";
        this.sprite= new Sprite({
            gameObject:this,
            src: config.src || "/images/characters/people/hero.png",
        }); // sprites of the character 
    }

    mount(map){ //
        console.log("mounting!");
        this.isMounted = true;
        map.addWall(this.x , this.y);
    }

    
update(){
    
}
}

