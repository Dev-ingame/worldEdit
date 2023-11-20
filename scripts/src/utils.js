import { world, ItemStack, system, Player, Block, BlockType, Vector } from "@minecraft/server"

const overworld = world.getDimension("overworld");

class Wand {
    _players = {};
    _undoStack = {};

    give(player) {
        try {
            const Name = player.name;
            const container = player.getComponent("inventory").container;
            const hand = player.selectedSlot;

            container.setItem(hand, new ItemStack("minecraft:wooden_axe", 1));
            const item = container.getSlot(hand);
            item.setLore(["WAND"]);

            if (this._players[Name]) {
                player.sendMessage(`§eYou're already in Edit Mode`);
            } else {
                this._players[Name] = { start: undefined, end: undefined, first: true };
            }
        } catch (err) {
            console.log(err);
        }
    }
    _toUndoStack(Name, changes) {
        if (!this._undoStack[Name]) {
            this._undoStack[Name] = [];
        }
        this._undoStack[Name].push(changes);
    }

    hasRequired(player) {
        const playerName = player.name;
        return !(this._players[playerName]?.start && this._players[playerName]?.end);
    }
    

    CalcuBlock(start, end) {
        const width = Math.abs(end.x - start.x) + 1;
        const height = Math.abs(end.y - start.y) + 1;
        const depth = Math.abs(end.z - start.z) + 1;
    
        return width * height * depth;
    }
    

    getBlock(x, y, z) {
        const block = overworld.getBlock(new Vector(x, y, z));
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
        if (this._undoStack[Name] && this._undoStack[Name].length > 0) {
            const changes = this._undoStack[Name].pop();
            changes.forEach((change) => {
                overworld.runCommand(`setblock ${change.x} ${change.y} ${change.z} ${change.blockType}`);
                // console.log(`${change.x} ${change.y} ${change.z} ${change.blockType}`)
            });
        }
    }

    Fill(player, blockType) {
        const Name = player.name;
        const changes = [];
        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);
        let i = 0, runtime

        const blocks = this.CalcuBlock(p1, p2);
    
        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if(i <= 20000){
                        runtime = system.runTimeout(e=>{
                            const block = this.getBlock(x, y, z);
                            changes.push({ x, y, z, blockType: block ? block.typeId : blockType });
                        }, 1)
                    }
                    if (i > 30000) {
                        runtime = system.runTimeout(() => {
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                        }, 30);
                        
                    } else {
                        runtime = system.runTimeout(() => {
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                        }, 20);
                        i++
                    }
                }
            }
        }
        system.clearRun(runtime)
    
        this._toUndoStack(Name, changes);
        return i;
    }
    

    FillKeep(player, blockType) {
        const Name = player.name;
        const changes = [];
        const {start, end } = this._players[Name];
        const {start: p1, end: p2} = this.#CalStartEnd(start,end)
        let i = 0, runtime

        const blocks = this.CalcuBlock(p1, p2);
        // console.log(p1.x)
        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if(i <= 20000){
                        runtime = system.runTimeout(e=>{
                            const block = this.getBlock(x, y, z);
                            changes.push({ x, y, z, blockType: block ? block.typeId : blockType });
                        }, 1)
                    }
                    if (i > 30000) {
                        runtime = system.runTimeout(() => {
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType} keep`);
                        }, 30);
                        
                    } else {
                        runtime = system.runTimeout(() => {
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType} keep`);
                        }, 20);
                        
                    }
                    i++
                }
            }
        
        }
        system.clearRun(runtime)
        this._toUndoStack(Name,changes)
        return i;
    }
    replace(player, blockType, RblockType) {
        const Name = player.name;
        const changes = [];
        const { start, end } = this._players[Name];
        const { start: p1, end: p2 } = this.#CalStartEnd(start, end);
    
        let i = 0, runtime, type;
        const blocks = this.CalcuBlock(p1, p2);
        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if(i <= 20000){
                        runtime = system.runTimeout(e=>{
                            const block = this.getBlock(x, y, z);
                            changes.push({ x, y, z, blockType: block ? block.typeId : blockType }); 
                        }, 1)
                    }
                    if (i > 30000) {
                        runtime = system.runTimeout(() => {
                            
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType} replace`);
                        }, 30);
                        
                    } else {
                        runtime = system.runTimeout(() => {
        
                            const result = overworld.runCommand(`fill ${x} ${y} ${z} ${x} ${y} ${z} ${RblockType} [] replace ${blockType}`);
                            
                            // console.log(`${x} ${y} ${z} ${blockType}`);
                            
                            
                        }, 20);
                        i++
                    }
                    
                }
            }
        }
        system.clearRun(runtime)
    
        this._toUndoStack(Name, changes);
        return i;
    }

    Hollow(player, blockType) {
        const Name = player.name;
        const { start, end } = this._players[Name];
        const changes = [];
        const {start: p1, end: p2} = this.#CalStartEnd(start,end)
        let i = 0;

        const blocks = this.CalcuBlock(p1,p2)
        try {
            for (let x = p1.x; x <= p2.x; x++) {
                for (let y = p1.y; y <= p2.y; y++) {
                    for (let z = p1.z; z <= p2.z; z++) {
                        if (x === p1.x || x === p2.x || y === p1.y || y === p2.y || z === p1.z || z === p2.z) {
                            const block = this.getBlock(x,y,z)
                            changes.push({ x, y, z, blockType: block.typeId });
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                            i++
                        }
                    }
                }
            }
        } catch (err) {
            return err
        }
        this._toUndoStack(Name,changes);

        return i;
    }
    Walls(player, blockType) {
        const Name = player.name;
        const { start, end } = this._players[Name];
        const changes = [];
        let i = 0;
        const {start: p1, end: p2} = this.#CalStartEnd(start,end)
        
        try {
            for (let x = p1.x; x <= p2.x; x++) {
                for (let y = p1.y; y <= p2.y; y++) {
                    for (let z = p1.z; z <= p2.z; z++) {
                        if (x === p1.x || x === p2.x || z === p1.z || z === p2.z) {
                            const block = this.getBlock(x,y,z)
                            changes.push({ x, y, z, blockType: block.typeId });
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                            i++
                        }
                    }
                }
            }
        } catch (err) {
            return err
        }
        this._toUndoStack(Name,changes)
        return i;
    }

    Sphere(player, blockType, radius) {
        const Name = player.name;
        const { start, end } = this._players[Name];
        const changes = [];
        let i = 0;
        const {start: p1, end: p2} = this.#CalStartEnd(start,end)

        const center = {
            x: Math.round((p1.x + p2.x) / 2),
            y: Math.round((p1.y + p2.y) / 2),
            z: Math.round((p1.z + p2.z) / 2),
        };
        
        if(radius == undefined) radius = Math.max((p2.x - p1.x) / 2, (p2.y - p1.y) / 2, (p2.z - p1.z) / 2);
        try {
            for (let x = p1.x; x <= p2.x; x++) {
                for (let y = p1.y; y <= p2.y; y++) {
                    for (let z = p1.z; z <= p2.z; z++) {
                        if (Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2) + Math.pow(z - center.z, 2) <= Math.pow(radius, 2)) {
                            system.runInterval(e=>{
                                const block = this.getBlock(x,y,z)
                                changes.push({ x, y, z, blockType: block.typeId })
                                overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                            })
                            i++
                        }
                    }
                }
            }
        } catch (err) {
            return err
        }
        
        this._toUndoStack(Name,changes) 
        return i;

    }
    

    Center(player) {
        const Name = player.name;
        const { start, end } = this._players[Name];
        let p1 = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), z: Math.min(start.z, end.z) };
        let p2 = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y), z: Math.max(start.z, end.z) };

        const center = {
            x: Math.round((p1.x + p2.x) / 2),
            y: Math.round((p1.y + p2.y) / 2),
            z: Math.round((p1.z + p2.z) / 2),
        };

        overworld.runCommand(`setblock ${center.x} ${center.y} ${center.z} bedrock`);
        return center;
    }
    

    
}
export const wand = new Wand();