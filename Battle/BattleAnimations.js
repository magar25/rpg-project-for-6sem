
window.BattleAnimations={
    async spin (event,onComplete){
        const element=event.caster.pizzaElement;
        const animationClassName = event.caster.team === "player" ? "battle-spin-right" :"battle-spin-left";
        element.classList.add(animationClassName);

        //remove class when animation is fully complete
        element.addEventListener("animationend",()=>{
            element.classList.remove(animationClassName);
        },{once:true} )

        //continue the battle cycle right around when the pizza collide
        await utils.wait(100);
        onComplete();
    }
}