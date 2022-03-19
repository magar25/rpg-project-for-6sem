

class OverworldEvent {
    constructor({map,event}){
        this.map=map;
        this.event= event;
}

//to check if standing events finished
stand(resolve){
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({
    map: this.map
    },{
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
        

    })
}

//to check if walking events finished
walk(resolve){

const who = this.map.gameObjects[this.event.who];
who.startBehavior({
map: this.map
},{
    type: "walk",
    direction: this.event.direction,
    retry: true
})



// set up a handler to complete when a person is done walking
const completeHandler = e =>{
    if(e.detail.whoId === this.event.who){
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
    }
}

document.addEventListener("PersonWalkingComplete", completeHandler);

}


main(){
    return new Promise(resolve =>{
        this [this.event.type](resolve)
    })
}
}