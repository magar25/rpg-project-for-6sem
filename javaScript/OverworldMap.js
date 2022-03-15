

class OverworldMap{
 constructor(config){

    this.gameObjects= config.gameObjects;
    this.walls =config.walls || {} ; // object for walls

    this.lowerImage = new Image(); // for images like floor, road ,grass etc
    this.lowerImage.src= config.lowerSrc;

    this.upperImage= new Image(); // for images like roof, treetop etc
    this.upperImage.src=config.upperSrc;


 }

 drawLowerImage(ctx, cameraPerson) {
     ctx.drawImage(
         this.lowerImage,
         utils.withGrid(10.5)-cameraPerson.x,
         utils.withGrid(6)-cameraPerson.y
         );
 }

 drawUpperImage(ctx, cameraPerson){
     ctx.drawImage(
         this.upperImage,
         utils.withGrid(10.5)-cameraPerson.x,
         utils.withGrid(6)-cameraPerson.y
         );
 }

 isSpaceTaken(currentX , currentY, direction){ //to check if we are aginst some kind of wall
     const{x,y}= utils.nextPosition(currentX, currentY ,direction);
     return this.walls[`${x},${y}`] || false;
 }

    mountObjects(){
        Object.values(this.gameObjects).forEach(o =>{
            //todo if this object is to mount or not
            o.mount(this);
        })
    }
    addWall(x,y){ // adding invisible wall
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y){ // removing invisible wall
       delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY , direction){
        this.removeWall(wasX ,wasY);
        const {x,y} =utils.nextPosition(wasX ,wasY, direction);
        this.addWall(x,y);
    }

}


window.OverworldMaps={ //object of all the maps in the game

    DemoRoom:{
        lowerSrc:"/images/maps/DemoLower.png",
        upperSrc:"/images/maps/DemoUpper.png",

        gameObjects:{
            
                hero:new Person({
                    isPlayerControlled:true, // it is true cause we can control this unit
                    x:utils.withGrid(5),
                    y:utils.withGrid(6),
                }),
                npc1: new Person({
                    x:utils.withGrid(7) ,
                    y:utils.withGrid(9),
                    src:"/images/characters/people/npc1.png"
                })
            
        },
        walls:{
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        }
    },
    Kitchen:{
        lowerSrc:"/images/maps/KitchenLower.png",
        upperSrc:"/images/maps/KitchenUpper.png",

        gameObjects:{
            
                hero:new GameObject({
                    x:utils.withGrid(3),
                     y:utils.withGrid(5),
                }),
                npcA: new GameObject({
                    x:utils.withGrid(9),
                    y:utils.withGrid(6),
                    src:"/images/characters/people/npc2.png"
                }),
                npcB: new GameObject({
                    x:utils.withGrid(10) ,
                    y:utils.withGrid(8),
                    src:"/images/characters/people/npc3.png"
                    
                }),
            
        }
    },

     
}
