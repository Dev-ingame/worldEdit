import "./src/utils";
import "./src/events/world";
import "./src/command/commands"




// export function commands(msg, actor, command, args) {
//     
//     switch (actor.isOp()) {
//         case true:
//             switch (command) {
//                 case "test":
//                     result = wand.CalcuBlock(wand._players[actor.name].start, wand._players[actor.name].end )
//                     actor.sendMessage(result)
//                     break;
//                 case "wand":
//                     wand.give(actor);
//                     break;
//                 case "pos1":
//                     wand._players[actor.name].start = location
//                     actor.sendMessage(`§aPosition 1: §e${wand._players[actor.name].start.x} §7/§e ${wand._players[actor.name].start.y} §7/§e ${wand._players[actor.name].start.z}`);

//                     break;
//                 case "pos2":
//                     wand._players[actor.name].end = location
//                     actor.sendMessage(`§aPosition 2: §e${wand._players[actor.name].end.x} §7/§e ${wand._players[actor.name].end.y} §7/§e ${wand._players[actor.name].end.z}`);
//                 break;
//                 case "undo":
//                     if (args[0]) return actor.sendMessage("§cCommand Does't Required Any Value");
//                     wand.Undo(actor)
//                     actor.sendMessage(`§dChange Undo`);
//                     break;
//                 case "fill":
//                     if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
//                     type = args[0].toLowerCase();
//                     if (wand.hasRequired(actor)) return actor.sendMessage("§cPlease specify a location");
//                     result = wand.Fill(actor,type)
//                     actor.sendMessage(`§eFilled ${result} Blocks `);
//                     break;
//                 case "keep":
//                     if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
//                     type = args[0].toLowerCase();
//                     if (wand.hasRequired(actor)) return actor.sendMessage("§cPlease specify a location");
//                     result = wand.FillKeep(actor,type)
//                     actor.sendMessage(`§eFilled ${result} Blocks `);
//                     break;
//                 case "hollow":
//                     if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
//                     type = args[0].toLowerCase();
//                     if (wand.hasRequired(actor)) return actor.sendMessage("§cPlease specify a location");
//                     result = wand.Hollow(actor,type);
//                     actor.sendMessage(`§eHallowed ${result} Blocks `);
//                     break;
//                 case "wall":
//                     if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
//                     type = args[0].toLowerCase();
//                     if (wand.hasRequired(actor)) return actor.sendMessage("§cPlease specify a location");
//                     wand.Walls(actor,type);
//                     actor.sendMessage(`§eWall Placed`);
//                     break;
//                 case "sphere":
//                     if (!args[0]) return actor.sendMessage("§cPlease specify a block type");
//                     type = args[0].toLowerCase();
//                     if (typeof args[1] == "number" && args[1] !==undefined) return actor.sendMessage("§cInvalid Input, Only Number is allowed");
//                     size = args[1]
//                     if (wand.hasRequired(actor)) return actor.sendMessage("§cPlease specify a location");
//                     result = wand.Sphere(actor,type, size);
//                     actor.sendMessage(`§eSphere Placed`);
//                     break;
//                 case "center":
//                     if (wand.hasRequired(actor)) return actor.sendMessage("§cPlease specify a location");
//                     result = wand.Center(actor);
//                     actor.sendMessage(`§8Center§a:§e \n§apos1:${wand._players[actor.name].start.x}, ${wand._players[actor.name].start.y}, ${wand._players[actor.name].start.z},\n§apos2: ${wand._players[actor.name].end.x}, ${wand._players[actor.name].end.y} ${wand._players[actor.name].end.z},§a\ncenter:§e ${result.x} / ${result.y} / ${result.z} `);
//                     break;
//                 default:
//                     actor.sendMessage(`§cUnknown Command§e: §e${command}`);
//                     break;
                    
//             }
//             break;
//         default:
//             actor.sendMessage(`§cYou don't have permission to use this command§e: ${command}`);
//             break;
//     }
// }

// world.afterEvents.chatSend.subscribe((ev) => {
//     const actor = ev.sender;
//     const msg = ev.message;
//     if (!msg.startsWith(prefix)) return;
//     const args = msg.slice(prefix.length).trim().split(/\s+/);
//     const command = args.shift();
//     commands(msg, actor, command, args);
// });

// world.beforeEvents.chatSend.subscribe(ev=>{
//     system.run(e=>{
//         const actor = ev.sender;
//         const msg = ev.message;
//         if (!msg.startsWith(prefix)) return;
//         const args = msg.slice(prefix.length).trim().split(/\s+/);
//         const command = args.shift();
//         commands(msg, actor, command, args);
//     })
//     ev.cancel = true
// })
