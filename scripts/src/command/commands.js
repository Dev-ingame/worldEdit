import { BlockStateType, BlockStates, world } from "@minecraft/server";
import { commandDesc, error, state } from "../../text/en-US";
import { language } from "../../text/languageHandler";
import { wand } from "../utils";
import { commandBuilder } from "./commandBuilder";
let size, result, type, Rtype, length;
commandBuilder.registerCommand("test", (msg, actor, command, args) => {
    // console.log(BlockStates.get("planks"));
    // world.sendMessage(BlockStateType);
});

commandBuilder.registerCommand("wand", (msg, actor, command, args) => {
    wand.give(actor);
});

commandBuilder.registerCommand("pos1", (msg, actor, command, args) => {
    const location = {
        x: actor.location.x.toFixed(),
        y: actor.location.y.toFixed(),
        z: actor.location.z.toFixed(),
    };
    wand._players[actor.name].start = location;
    actor.sendMessage(
        `§aPosition 1: §e${wand._players[actor.name].start.x} §7/§e ${
            wand._players[actor.name].start.y
        } §7/§e ${wand._players[actor.name].start.z}`,
    );
});

commandBuilder.registerCommand("pos2", (msg, actor, command, args) => {
    const location = {
        x: actor.location.x.toFixed(),
        y: actor.location.y.toFixed(),
        z: actor.location.z.toFixed(),
    };
    wand._players[actor.name].end = location;
    actor.sendMessage(
        `§aPosition 2: §e${wand._players[actor.name].end.x} §7/§e ${
            wand._players[actor.name].end.y
        } §7/§e ${wand._players[actor.name].end.z}`,
    );
});

commandBuilder.registerCommand("undo", (msg, actor, command, args) => {
    if (args[0]) return actor.sendMessage(error.noVal);
    wand.Undo(actor);
    actor.sendMessage(commandDesc.undo);
});

commandBuilder.registerCommand("fill", (msg, actor, command, args) => {
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();

    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    const result = wand.Fill(actor, type, args[1]);
    actor.sendMessage(language(commandDesc.fill, "result", result));
    // wand.Fill(actor, type).then((e) => {
    //     actor.sendMessage(language(commandDesc.fill, "", "", e));
    // });
});
commandBuilder.registerCommand("triangle", (msg, actor, command, args) => {
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (typeof args[1] == "number" && args[1] !== undefined)
        return actor.sendMessage(error.onlyNum);

    const result = wand.Triangle(actor, type, args[1], args[2]);
    actor.sendMessage(language(commandDesc.fill, "result", result));
    // wand.Fill(actor, type).then((e) => {
    //     actor.sendMessage(language(commandDesc.fill, "", "", e));
    // });
});
commandBuilder.registerCommand("copy", (msg, actor, command, args) => {
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    const result = wand.Copy(actor);
    actor.sendMessage(language(commandDesc.copy, "result", result));
});

commandBuilder.registerCommand("paste", (msg, actor, command, args) => {
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    const result = wand.Paste(actor, type);
    actor.sendMessage(language(commandDesc.paste, "result", result));
});

commandBuilder.registerCommand("keep", (msg, actor, command, args) => {
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    const result = wand.FillKeep(actor, type);
    actor.sendMessage(language(commandDesc.fill, "result", result));
});

commandBuilder.registerCommand("replace", (msg, actor, command, args) => {
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (!args[1]) return actor.sendMessage(error.noBType);
    Rtype = args[1].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.replace(actor, type, Rtype);

    actor.sendMessage(language(commandDesc.replace, "result", result));
});

commandBuilder.registerCommand("hollow", (msg, actor, command, args) => {
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Hollow(actor, type, Rtype);
    actor.sendMessage(language(commandDesc.hollow, "result", result));
});

commandBuilder.registerCommand("sphere", (msg, actor, command, args) => {
    if (typeof !args[0] == "string") return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (typeof args[1] == "number" && args[1] !== undefined)
        return actor.sendMessage(error.onlyNum);
    size = args[1];
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Sphere(actor, type, size);
    actor.sendMessage(language(commandDesc.sphere, "result", result));
});

commandBuilder.registerCommand("wall", (msg, actor, command, args) => {
    if (!args[0]) return actor.sendMessage(error.noBType);
    type = args[0].toLowerCase();
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Walls(actor, type);
    actor.sendMessage(language(commandDesc.wall, "result", result));
});

commandBuilder.registerCommand("center", (msg, actor, command, args) => {
    if (wand.hasRequired(actor)) return actor.sendMessage(error.noPos);
    result = wand.Center(actor);
    actor.sendMessage(
        language(commandDesc.center, "result", [
            "Center: ",
            "§aX:§e ",
            result.x,
            " §aY:§e ",
            result.y,
            " §aZ:§e ",
            result.z,
        ]),
    );
});
