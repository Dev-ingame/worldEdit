import { world, system, Player } from "@minecraft/server";
import { wand } from "../utils";
import { debug } from "../../config";

const players = world.getPlayers();
const overworld = world.getDimension("overworld");

world.afterEvents.worldInitialize.subscribe((ev) => {
    if (debug == true) {
        world.sendMessage("World Initialized");
        players.forEach((player) => {
            if (!wand._players[player.name]) {
                wand._players[player.name] = {
                    start: undefined,
                    end: undefined,
                };
            }
        });
    }
});

/**
 *
 * @param {Player} player
 * @returns
 */
function gethand(player) {
    const hand = player.selectedSlotIndex;
    const item = player.getComponent("inventory").container.getSlot(hand);
    console.log(item.hasItem());
    if (!item.hasItem()) return { item: null, wnd: null };
    const wnd = item.getLore().find((e) => e == "WAND");
    return { item, wnd };
}

world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;

    if (wand._players[player.name]) {
        const { wnd } = gethand(ev.player);
        if (!wnd) return;
        wand._players[player.name].start = ev.block.location;
        player.sendMessage(
            `§aPosition 1: §e${wand._players[player.name].start.x} §7/§e ${
                wand._players[player.name].start.y
            } §7/§e ${wand._players[player.name].start.z}`,
        );
        ev.cancel = true;
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const player = ev.player;

    if (wand._players[player.name]) {
        const {  wnd } = gethand(ev.player);
        if (!wnd) return;
        wand._players[player.name].end = ev.block.location;
        player.sendMessage(
            `§aPosition 2: §e${wand._players[player.name].end.x} §7/§e ${
                wand._players[player.name].end.y
            } §7/§e ${wand._players[player.name].end.z}`,
        );
        ev.cancel = true;
    }
});
