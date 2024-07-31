import { world, ItemStack, Player } from "@minecraft/server";

const overworld = world.getDimension("overworld");
const player = world.getPlayers()[0];
class Wand {
    _players = {};
    _undoStack = {};
    _redoStack = {};
    _cloneStack = {};

    /**
     * @param {Player} actor
     */
    give(actor) {
        console.log("test");
        const Name = actor.name;
        const container = actor.getComponent("inventory").container
        const hand = actor.selectedSlotIndex

        console.log(hand)

        container.setItem(hand, new ItemStack("minecraft:wooden_axe"));
        const item = container.getSlot(hand);
        item.setLore(["WAND"]);

        if (this._players[Name]) {
            player.sendMessage(`§eYou're already in Edit Mode`);
        } else {
            this._players[Name] = { start: undefined, end: undefined };
        }
    }
    async _toUndoStack(Name, changes) {
        if (!this._undoStack[Name]) {
            this._undoStack[Name] = [];
        }
        this._undoStack[Name].push(changes);
    }
    async _toRedoStack(Name, changes) {
        if (!this._redoStack[Name]) {
            this._redoStack[Name] = [];
        }
        this._redoStack[Name].push(changes);
    }

    async runCommandBatch(commands) {
        try {
            for (const command of commands) {
                await overworld.runCommand(command);
            }
        } catch (error) {
            return "invalid block"
        }
    }
    center(start, end) {
        const p1 = start;
        const p2 = end;

        const center = {
            x: Math.round((p1.x + p2.x) / 2),
            y: Math.round((p1.y + p2.y) / 2),
            z: Math.round((p1.z + p2.z) / 2),
        };
        return center;
    }

    hasRequired(player) {
        const playerName = player.name;
        return !(
            this._players[playerName]?.start && this._players[playerName]?.end
        );
    }

    CalcuBlock(start, end) {
        const width = Math.abs(end.x - start.x) + 1;
        const height = Math.abs(end.y - start.y) + 1;
        const depth = Math.abs(end.z - start.z) + 1;

        return width * height * depth;
    }

    getBlock(x, y, z) {
        const block = overworld.getBlock({ x, y, z });
        return block || null;
    }
    #CalStartEnd(start, end) {
        return {
            start: {
                x: Math.min(start.x, end.x),
                y: Math.min(start.y, end.y),
                z: Math.min(start.z, end.z),
            },
            end: {
                x: Math.max(start.x, end.x),
                y: Math.max(start.y, end.y),
                z: Math.max(start.z, end.z),
            },
        };
    }

    Undo(player) {
        const Name = player.name;
        const commands = [];
        const redochanges = [];
        const changes = this._undoStack[Name];
        if (changes && changes.length > 0) {
            const changes = this._undoStack[Name].pop();

            changes.forEach((change) => {
                const blocks = this.getBlock(change.x, change.y, change.z);
                redochanges.push({
                    x: change.x,
                    y: change.y,
                    z: change.z,
                    blockType: blocks.typeId,
                });
                commands.push(
                    `setblock ${change.x} ${change.y} ${change.z} ${change.blockType}`,
                );
            });
        }
        this._toRedoStack(Name, redochanges);
        this.runCommandBatch(commands);
    }
    Redo(player) {
        const Name = player.name;
        const commands = [];
        const undochanges = [];
        const changes = this._redoStack[Name];

        if (changes && changes.length > 0) {
            const changes = this._redoStack[Name].pop();
            changes.forEach((change) => {
                const blocks = this.getBlock(change.x, change.y, change.z);
                undochanges.push({
                    x: change.x,
                    y: change.y,
                    z: change.z,
                    blockType: blocks.typeId,
                });
                commands.push(
                    `setblock ${change.x} ${change.y} ${change.z} ${change.blockType}`,
                );
            });
        }
        this._toUndoStack(Name, undochanges);
        this.runCommandBatch(commands);
    }
    Copy(player) {
        const Name = player.name;
        const changes = [];
        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    const block = this.getBlock(x, y, z);

                    changes.push({
                        x,
                        y,
                        z,
                        blockType: block ? block.typeId : "Bedrock",
                    });
                }
            }
        }

        this._cloneStack[Name] = [...changes];

        return changes.length;
    }
    Paste(player, facing = "north") {
        const Name = player.name;
        const commands = [];
        const undochange = [];
        const changes = this._cloneStack[Name];
        const { start } = this._players[Name];

        if (changes && changes.length > 0) {
            changes.forEach((change) => {
                const newX = start.x + (change.x - changes[0].x);
                const newY = start.y + (change.y - changes[0].y);
                const newZ = start.z + (change.z - changes[0].z);

                // Adjust the position based on the facing direction
                let adjustedX = newX;
                let adjustedZ = newZ;

                switch (facing.toLowerCase()) {
                    case "east":
                        adjustedX = start.x + (changes[0].z - change.z);
                        adjustedZ = start.z + (change.x - changes[0].x);
                        break;
                    case "south":
                        adjustedX = start.x + (changes[0].x - change.x);
                        adjustedZ = start.z + (changes[0].z - change.z);
                        break;
                    case "west":
                        adjustedX = start.x + (change.z - changes[0].z);
                        adjustedZ = start.z + (changes[0].x - change.x);
                        break;
                    default:
                        adjustedX = newX;
                        adjustedZ = newZ;
                        break;
                }
                const block = this.getBlock(adjustedX, newY, adjustedZ);

                undochange.push({
                    x: adjustedX,
                    y: newY,
                    z: adjustedZ,
                    blockType: block ? block.typeId : blockType,
                });
                commands.push(
                    `setblock ${adjustedX} ${newY} ${adjustedZ} ${change.blockType}`,
                );
            });

            this.runCommandBatch(commands);
            this._toUndoStack(Name, undochange);
            return changes.length;
        }
    }

    Fill(player, blockType, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];
        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    const block = this.getBlock(x, y, z);

                    changes.push({
                        x,
                        y,
                        z,
                        blockType: block ? block.typeId : blockType,
                    });
                    commands.push(
                        `setblock ${x} ${y} ${z} ${blockType} ${state}`,
                    );
                }
            }
        }
        this.runCommandBatch(commands).finally((e) => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }
    replace(player, blockType, newblockType, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];
        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    const block = this.getBlock(x, y, z);
                    changes.push({
                        x,
                        y,
                        z,
                        blockType: block ? block.typeId : blockType,
                    });
                    if (block.typeId.replace("minecraft:", "") == blockType) {
                        commands.push(
                            `setblock ${x} ${y} ${z} ${newblockType} ${state}`,
                        );
                    }
                }
            }
        }
        this.runCommandBatch(commands).finally((e) => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }

    FillKeep(player, blockType, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];

        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    const block = this.getBlock(x, y, z);

                    changes.push({
                        x,
                        y,
                        z,
                        blockType: block ? block.typeId : blockType,
                    });
                    commands.push(
                        `setblock ${x} ${y} ${z} ${blockType} ${state} keep`,
                    );
                }
            }
        }
        this.runCommandBatch(commands).finally((e) => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }

    Hollow(player, blockType, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];

        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (
                        x === p1.x ||
                        x === p2.x ||
                        y === p1.y ||
                        y === p2.y ||
                        z === p1.z ||
                        z === p2.z
                    ) {
                        const block = this.getBlock(x, y, z);
                        changes.push({ x, y, z, blockType: block.typeId });
                        commands.push(
                            `setblock ${x} ${y} ${z} ${blockType} ${state}`,
                        );
                    }
                }
            }
        }

        this.runCommandBatch(commands).finally((e) => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }
    Walls(player, blockType, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];

        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (x === p1.x || x === p2.x || z === p1.z || z === p2.z) {
                        const block = this.getBlock(x, y, z);
                        changes.push({ x, y, z, blockType: block.typeId });
                        commands.push(
                            `setblock ${x} ${y} ${z} ${blockType} ${state}`,
                        );
                    }
                }
            }
        }

        this.runCommandBatch(commands).finally((e) => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }

    Sphere(player, blockType, radius, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];

        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);

        const center = this.center(start, end);

        if (radius == undefined)
            radius = Math.max(
                (p2.x - p1.x) / 2,
                (p2.y - p1.y) / 2,
                (p2.z - p1.z) / 2,
            );

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (
                        Math.pow(x - center.x, 2) +
                            Math.pow(y - center.y, 2) +
                            Math.pow(z - center.z, 2) <=
                        Math.pow(radius, 2)
                    ) {
                        const block = this.getBlock(x, y, z);
                        changes.push({ x, y, z, blockType: block.typeId });
                        commands.push(
                            `setblock ${x} ${y} ${z} ${blockType} ${state}`,
                        );
                    }
                }
            }
        }

        this.runCommandBatch(commands).finally((e) => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }

    Triangle(player, blockType, height, state = "") {
        const Name = player.name;
        const changes = [];
        const commands = [];

        const { start } = this._players[Name];

        let x = Math.max(-612, Math.min(start.x, 612));
        const y = start.y;
        let z = Math.max(-612, Math.min(start.z, 612));

        const halfWidth = Math.floor(height / 2);
        for (let yOffset = 0; yOffset < height; yOffset++) {
            const currentY = y + yOffset;
            const width = halfWidth - yOffset;

            for (let xOffset = -width; xOffset <= width; xOffset++) {
                for (let zOffset = -width; zOffset <= width; zOffset++) {
                    const currentX = x + xOffset;
                    const currentZ = z + zOffset;

                    const currentXClamped = Math.max(
                        -612,
                        Math.min(currentX, 612),
                    );
                    const currentZClamped = Math.max(
                        -612,
                        Math.min(currentZ, 612),
                    );

                    const block = this.getBlock(
                        currentXClamped,
                        currentY,
                        currentZClamped,
                    );
                    changes.push({
                        x: currentXClamped,
                        y: currentY,
                        z: currentZClamped,
                        blockType: block ? block.typeId : blockType,
                    });
                    commands.push(
                        `setblock ${currentXClamped} ${currentY} ${currentZClamped} ${blockType} ${state}`,
                    );
                }
            }
        }

        this.runCommandBatch(commands).finally(() => {
            this._toUndoStack(Name, changes);
            world.sendMessage("Done");
        });
        return changes.length;
    }

    Center(player) {
        const Name = player.name;
        const { start, end } = this._players[Name];
        const Center = this.center(start, end);

        overworld.runCommand(
            `setblock ${Center.x} ${Center.y} ${Center.z} bedrock`,
        );
        return Center;
    }
}
export const wand = new Wand();
