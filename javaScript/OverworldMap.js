

class OverworldMap{
 constructor(config){

    this.gameObjects= config.gameObjects;

    this.lowerImage = new Image(); // for images like floor, road ,grass etc
    this.lowerImage.src= config.lowerSrc;

    this.upperImage= new Image(); // for images like roof, treetop etc
    this.upperImage.src=config.upperSrc;


 }

 drawLowerImage(ctx) {
     ctx.drawImage(this.lowerImage,0,0);
 }

 drawUpperImage(ctx){
     ctx.drawImage(this.upperImage,0,0);
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
                npc1: new GameObject({
                    x:utils.withGrid(7) ,
                    y:utils.withGrid(9),
                    src:"/images/characters/people/npc1.png"
                })
            
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
