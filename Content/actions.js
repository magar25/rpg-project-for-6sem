window.Actions = {
    damage1: {
        name: "Whomp!",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 10 },
        ]
    },
    saucyStatus: {
        name: "Tomato Squeeze",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", status:{type:"saucy" ,expiresIn:3 }},
        ]
    },
    SupersaucyStatus: {
        name: "Super Tomato Squeeze !!!!!",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", status:{type:"saucy" ,expiresIn:10 }},
        ]
    },


}