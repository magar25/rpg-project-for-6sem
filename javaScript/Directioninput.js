

class DirectionInput{
    constructor(){
        this.heldDirections=[];

        //mapping keys to be used
        this.map={
            "ArrowUp":"up",
            "keyW":"up",
            "ArrowDown":"down",
            "keyS":"down",
            "ArrowLeft":"left",
            "keyA":"left",
            "ArrowRight":"right",
            "keyD":"right",
        }
    }
    get direction(){
        return this.heldDirections[0];
    }
    main(){
        document.addEventListener("keydown",e=>{
            
            const dir= this.map[e.code];
            if(dir && this.heldDirections.indexOf(dir)===-1){ //check if we pressed the valid key
                this.heldDirections.unshift(dir); // if unvalid the character wont move
                console.log(this.heldDirections);
            }
        });

        document.addEventListener("keyup",e=>{
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if(index>-1){ //to return empty array if we release the valid key
                this.heldDirections.splice(index,1);
                console.log(this.heldDirections);
            }

        })
    }
}
    

