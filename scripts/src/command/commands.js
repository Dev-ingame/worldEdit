import { BlockType } from "@minecraft/server";
import { commandDesc, error } from "../../text/en-US";
import { language } from "../../text/languageHandler";
import { wand } from "../utils";
import { commandBuilder } from "./commandBuilder";
let size, result, type, Rtype;
commandBuilder.registerCommand("test", (msg, actor, command, args) => {
    const result = wand.CalcuBlock(wand._players[actor.name].start, wand._players[actor.name].end);
    actor.sendMessage(result);
});

commandBuilder.registerCommand("wand", (msg, actor, command, args) => {
    wand.give(actor);
});

commandBuilder.registerCommand("pos1", (msg, actor, command, args) =>{
    const location = {
        x: actor.location.x.toFixed(),
        y: actor.location.y.toFixed(),
        z: actor.location.z.toFixed()
    };
    wand._players[actor.name].start = location
    actor.sendMessage(`§aPosition 1: §e${wand._players[actor.name].start.x} §7/§e ${wand._players[actor.name].start.y} §7/§e ${wand._players[actor.name].start.z}`);
})

commandBuilder.registerCommand("pos2", (msg, actor, command, args) =>{
    const location = {
        x: actor.location.x.toFixed(),
        y: actor.location.y.toFixed(),
        z: actor.location.z.toFixed()
    };
    wand._players[actor.name].end = location
    actor.sendMessage(`§aPosition 2: §e${wand._players[actor.name].end.x} §7/§e ${wand._players[actor.name].end.y} §7/§e ${wand._players[actor.name].end.z}`);
})

commandBuilder.registerCommand("undo", (msg, actor, command, args) =>{
    if (args[0]) return actor.sendMessage(error.noVal);
    wand.Undo(actor)
    actor.sendMessage(commandDesc.undo);
})

commandBuilder.registerCommand("fill", (msg, actor, command, args) =>{
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Fill(actor,type)
    actor.sendMessage(language(commandDesc.fill,'','',result));
})

commandBuilder.registerCommand("keep", (msg, actor, command, args) =>{
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.FillKeep(actor,type)
    actor.sendMessage(language(commandDesc.keep,'','',result));
})

// commandBuilder.registerCommand("replace", (msg, actor, command, args) =>{
//     if (!args[0]) return actor.sendMessage(error.noBType);
//     type = args[0].toLowerCase();
//     if (!args[1]) return actor.sendMessage(error.noBType);
//     Rtype = args[0].toLowerCase();
//     if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
//     result = wand.replace(actor,Rtype,type)
    
//     actor.sendMessage(language(commandDesc.replace,'','',result));
// })

commandBuilder.registerCommand("hollow", (msg, actor, command, args) =>{
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Hollow(actor,type)
    actor.sendMessage(language(commandDesc.hollow,'','',result));
})

commandBuilder.registerCommand("sphere", (msg, actor, command, args) =>{
    if (typeof !args[0] == "string") return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (typeof args[1] == "number" && args[1] !==undefined) return actor.sendMessage(error.onlyNum);
    size = args[1]
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Sphere(actor,type, size)
    actor.sendMessage(language(commandDesc.sphere,'','',result));
})

commandBuilder.registerCommand("wall", (msg, actor, command, args) =>{
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Walls(actor,type)
    actor.sendMessage(language(commandDesc.wall,'','',result));
})

commandBuilder.registerCommand("center", (msg, actor, command, args) =>{
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Center(actor)
    actor.sendMessage(language(commandDesc.center,'','',result));
})











