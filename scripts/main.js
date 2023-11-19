import { world, Player, ItemStack} from "@minecraft/server"
import { wand } from "./utils"  
const prefix = "!"

// world.afterEvents.playerSpawn.subscribe(ev=>{
//     const player = ev.playerName
//     wand._players[player]
// })
world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const hand = player.selectedSlot;
    const item = player.getComponent("inventory").container.getSlot(hand);
    const wnd = item.getLore().find((e) => e == "WAND");

    if (wnd && wand._players[player.name]) {

        if (wand._players[player.name].first) {
            wand._players[player.name].start = ev.block.location;
            player.sendMessage(`§aPosition 1: §e${wand._players[player.name].start.x} §7/§e ${wand._players[player.name].start.y} §7/§e ${wand._players[player.name].start.z}`);
            wand._players[player.name].first = false;
        } else {
            wand._players[player.name].end = ev.block.location;
            player.sendMessage(`§aPosition 2: §e${wand._players[player.name].end.x} §7/§e ${wand._players[player.name].end.y} §7/§e ${wand._players[player.name].end.z}`);
            wand._players[player.name].first = true;
        }
        ev.cancel = true;
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const player = ev.player;
    const hand = player.selectedSlot;
    const item = player.getComponent("inventory").container.getSlot(hand);
    const wnd = item.getLore().find((e) => e == "WAND");

    if (wnd && wand._players[player.name]) {
        wand._players[player.name].end = ev.block.location;
        player.sendMessage(`§aPosition 2: §e${wand._players[player.name].end.x} §7/§e ${wand._players[player.name].end.y} §7/§e ${wand._players[player.name].end.z}`);
        wand._players[player.name].first = true;
        ev.cancel = true;
    }
});

export function commands(msg, actor, command, args) {
    let type
    let result
    let size 
    let location = {
        x:actor.location.x.toFixed(),
        y:actor.location.y.toFixed(),
        z:actor.location.z.toFixed()
        
    }
    switch (actor.isOp()) {
        case true:
            switch (command) {
                case "test":
                    actor.sendMessage(`${wand._players[actor.name].start.x}, ${wand._players[actor.name].end}, ${wand._players[actor.name].first}`)
                    break;
                case "wand":
                    wand.give(actor);
                    break;
                case "pos1":
                    wand._players[actor.name].start = location
                    actor.sendMessage(`§aPosition 1: §e${wand._players[actor.name].start.x} §7/§e ${wand._players[actor.name].start.y} §7/§e ${wand._players[actor.name].start.z}`);

                    break;
                case "pos2":
                    wand._players[actor.name].end = location
                    actor.sendMessage(`§aPosition 2: §e${wand._players[actor.name].end.x} §7/§e ${wand._players[actor.name].end.y} §7/§e ${wand._players[actor.name].end.z}`);

                break;
                case "fill":
                    if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
                    type = args[0].toLowerCase();
                    if (wand.Perm(actor)) return actor.sendMessage("§cPlease specify a location");
                    result = wand.Fill(actor,type);
                    actor.sendMessage(`§eFilled ${result} Blocks `);
                    break;
                case "hollow":
                    if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
                    type = args[0].toLowerCase();
                    if (wand.Perm(actor)) return actor.sendMessage("§cPlease specify a location");
                    result = wand.Hollow(actor,type);
                    actor.sendMessage(`§eHallowed ${result} Blocks `);
                    break;
                case "wall":
                    if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
                    type = args[0].toLowerCase();
                    if (wand.Perm(actor)) return actor.sendMessage("§cPlease specify a location");
                    wand.Walls(actor,type);
                    actor.sendMessage(`§eWall Placed`);
                    break;
                case "sphere":
                    if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
                    type = args[0].toLowerCase();
                    if (typeof args[1] == "number" && args[1] !==undefined) return actor.sendMessage("§cInvalid Input, Only Number is allowed");
                    size = args[1]
                    if (wand.Perm(actor)) return actor.sendMessage("§cPlease specify a location");
                    wand.Sphere(actor,type, size);
                    console.log(size)
                    actor.sendMessage(`§eSphere Placed`);
                    break;
                case "center":
                    if (wand.Perm(actor)) return actor.sendMessage("§cPlease specify a location");
                    result = wand.Center(actor);
                    actor.sendMessage(`§8Center§a:§e \n§apos1:${wand._players[actor.name].start.x}, ${wand._players[actor.name].start.y}, ${wand._players[actor.name].start.z},\n§apos2: ${wand._players[actor.name].end.x}, ${wand._players[actor.name].end.y} ${wand._players[actor.name].end.z},§a\ncenter:§e ${result.x} / ${result.y} / ${result.z} `);
                    break;
                default:
                    actor.sendMessage(`§cUnknown Command§e: §e${command}`);
                    break;
                    
            }
            break;
        default:
            actor.sendMessage(`§cYou don't have permission to use this command§e: ${command}`);
            break;
    }
}

world.afterEvents.chatSend.subscribe((ev) => {
    const actor = ev.sender;
    const msg = ev.message;
    if (!msg.startsWith(prefix)) return;
    const args = msg.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift();
    commands(msg, actor, command, args);
});

// world.beforeEvents.chatSend.subscribe(ev=>{
//     const msg  = ev.message
//     if (!msg.startsWith(prefix)) return;
//     ev.cancel = true 
// })
