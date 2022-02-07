

class Person extends GameObject{
    constructor(config){
        super(config);
        this.movingPogressRemaining=0; // initial position

        this.isPlayerControlled = config.isPlayerControlled ||false; // it is false so we cannot control any unit

        this.directionUpdate={
            "up":["y",-1],
            "down":["y",1],
            "left":["x",-1],
            "right":["x",1],
        }
    }

    update(state){
        this.updatePosition();

        if(this.isPlayerControlled && this.movingPogressRemaining===0 && state.arrow){  //move only after finishing moving 
            this.direction=state.arrow; // taking arrow key 
            this.movingPogressRemaining=16; //reset the counter to 16 or grid size
        }
    }

    updatePosition(){
        if(this.movingPogressRemaining>0){
            const[property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingPogressRemaining -=1;
        }
    }
}