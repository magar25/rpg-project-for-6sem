//type of pizzas
window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
}


//defining different types of pizza
window.Pizzas = {
    "s001": {
        name: "Slice Samurai",
        description:"pizza desc here",
        type: PizzaTypes.spicy,
        src: "/images/characters/pizzas/s001.png",
        icon: "/images/icons/spicy.png",
        actions: ["damage1"],
    },
    "v001": {
        name: "Call Me Kale",
        description:" my name is kale, vagge kale",
        type: PizzaTypes.veggie,
        src: "/images/characters/pizzas/v001.png",
        icon: "/images/icons/veggie.png",
        actions: ["damage1"],
    },
    "f001": {
        name: "Portobello Express",
        description:"I am Fun guy",
        type: PizzaTypes.fungi,
        src: "/images/characters/pizzas/f001.png",
        icon: "/images/icons/fungi.png",
        actions: ["damage1"],
    },
    "c001": {
        name: "frozen pizza",
        description:"take a chill pill",
        type: PizzaTypes.chill,
        src: "/images/characters/pizzas/c001.png",
        icon: "/images/icons/chill.png",
        actions: ["saucyStatus","clumsyStatus","damage1"],
    },

}