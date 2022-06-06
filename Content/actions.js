window.Actions = {
    damage1: {
        name: "Whomp!",
        description:"Pillowy punch of dough",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 10 },
        ]
    },
    saucyStatus: {
        name: "Tomato Squeeze",
        description:"Recover HP over time ",
        targetType:"friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", status:{type:"saucy" ,expiresIn:3 }},
        ]
    },
    SupersaucyStatus: {
        name: "Super Tomato Squeeze !!!!!",
        description:"Recover HP over long period of time ",
        targetType:"friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", status:{type:"saucy" ,expiresIn:10 }},
        ]
    },
     clumsyStatus: {
        name: "Olive Oil",
        description:" Slippery mess of deliciousness",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            {type:"animation",animation:"glob", color:"#dafd2a"},
            { type: "stateChange", status:{type:"clumsy" ,expiresIn:3 }},
            { type: "textMessage", text: "{TARGET} is slipping all around!" },
        ]
    },


    //Items

    item_recoverStatus:{
        name:"Heating Lamp",
        description:"Feeling fresh",
        targetType:"friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", status:null},
            {type:"textMessage", text:"feeling fresh!"},
        ]
    },
    item_recoverHp:{
        name:"Parmesan",
        description:"Feeling warm",
        targetType:"friendly",
        success: [
            { type: "textMessage", text: "{CASTER} sprinkels on some {ACTION}!" },
            { type: "stateChange", recover:10},
            {type:"textMessage", text:"{CASTER} recovers some HP"},
        ]
    },


}