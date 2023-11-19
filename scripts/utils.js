import { world, ItemStack, system, Player, Block, BlockType } from "@minecraft/server"

const overworld = world.getDimension("overworld");

class Wand {
    _players = {};
    
    give(player) {
        try {
            const playerName = player.name;
            const container = player.getComponent("inventory").container;
            const hand = player.selectedSlot;

            container.setItem(hand, new ItemStack("minecraft:wooden_axe", 1));
            const item = container.getSlot(hand);
            item.setLore(["WAND"]);

            this._players[playerName]
            if(this._players[playerName]){
                player.sendMessage(`§eYour Already On Edit Mode`)
            } else {
                this._players[playerName] = { start: undefined, end: undefined, first: true };
            }
            
        } catch (err) {
            console.log(err);
        }
    }
    Perm(player){
        const Name = player.name
        if(this._players[Name].start == undefined || this._players[Name].end == undefined){
            return true
        }
        return false
    }

    CalcuBlock(start, end) {
        let Blocks = 0;

        for (let x = start.x; x <= end.x; x++) {
            for (let y = start.y; y <= end.y; y++) {
                for (let z = start.z; z <= end.z; z++) {
                    Blocks++;
                }
            }
        }
        return Blocks;
    }

    Fill(player, blockType) {
        const playerName = player.name;
        const { start, end } = this._players[playerName];
        let p1 = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), z: Math.min(start.z, end.z) };
        let p2 = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y), z: Math.max(start.z, end.z) };

        const blocks = this.CalcuBlock(p1, p2);
        let i = 0;
        // console.log(p1.x)
        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (blocks > 30000) {
                        system.runTimeout(() => {
                            overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                            console.log(x, y, z);
                        }, i / 5);
                        i++;
                    } else {
                        overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                    }
                }
            }
        }
        return blocks;
    }

    Hollow(player, blockType) {
        const playerName = player.name;
        const { start, end } = this._players[playerName];
        let p1 = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), z: Math.min(start.z, end.z) };
        let p2 = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y), z: Math.max(start.z, end.z) };
        
        const blocks = this.CalcuBlock(p1,p2)
        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (x === p1.x || x === p2.x || y === p1.y || y === p2.y || z === p1.z || z === p2.z) {
                        overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                    }
                }
            }
        }
        return blocks
    }
    Walls(player, blockType) {
        const playerName = player.name;
        const { start, end } = this._players[playerName];
        
        let p1 = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), z: Math.min(start.z, end.z) };
        let p2 = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y), z: Math.max(start.z, end.z) };
        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (x === p1.x || x === p2.x || z === p1.z || z === p2.z) {
                        overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                    }
                }
            }
        }
    }

    Sphere(player, blockType, radius) {
        const playerName = player.name;
        
        const { start, end } = this._players[playerName];
    
        let p1 = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), z: Math.min(start.z, end.z) };
        let p2 = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y), z: Math.max(start.z, end.z) };
    
        const center = {
            x: Math.round((p1.x + p2.x) / 2),
            y: Math.round((p1.y + p2.y) / 2),
            z: Math.round((p1.z + p2.z) / 2),
        };

        if(radius == undefined) radius = Math.max((p2.x - p1.x) / 2, (p2.y - p1.y) / 2, (p2.z - p1.z) / 2);

        for (let x = p1.x; x <= p2.x; x++) {
            for (let y = p1.y; y <= p2.y; y++) {
                for (let z = p1.z; z <= p2.z; z++) {
                    if (Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2) + Math.pow(z - center.z, 2) <= Math.pow(radius, 2)) {
                        overworld.runCommand(`setblock ${x} ${y} ${z} ${blockType}`);
                    }
                }
            }
        }
    }
    

    Center(player) {
        const playerName = player.name;
        const { start, end } = this._players[playerName];
        let p1 = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), z: Math.min(start.z, end.z) };
        let p2 = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y), z: Math.max(start.z, end.z) };

        const center = {
            x: Math.round((p1.x + p2.x) / 2),
            y: Math.round((p1.y + p2.y) / 2),
            z: Math.round((p1.z + p2.z) / 2),
        };

        overworld.runCommand(`setblock ${cX} ${cY} ${cZ} bedrock`);
        return center;
    }

    
}
export const wand = new Wand();