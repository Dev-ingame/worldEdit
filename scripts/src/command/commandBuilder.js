import { world, system } from "@minecraft/server";
import { prefix } from "../../config"
import { wand } from "../utils";
import { error, state } from "../../text/en-US";
import { language } from "../../text/languageHandler";

class CommandBuilder {
    constructor() {
        this.commands = new Map();
    }

    registerCommand(command, handler) {
        this.commands.set(command, handler);
    }
    handleChatMessage(msg, actor) {
        try {
            if (msg.startsWith(prefix)) {
                const args = msg.slice(prefix.length).trim().split(/\s+/);
                const command = args.shift();

                if (this.commands.has(command)) {
                    if (actor && actor.isOp()) {
                        this.commands.get(command)(msg, actor, command, args);
                    } else {
                        console.error(error.cantExecute,command,actor);
                        if (actor) {
                            actor.sendMessage(error.isOp,command);
                        }
                    }
                } else {
                    if (actor) {
                        actor.sendMessage(language(error.unknownCommand,command));
                    }
                }
            }
        } catch (err) {
            console.error("Error handling chat message:", err);
        }
    }
}
export const commandBuilder = new CommandBuilder()

world.beforeEvents.chatSend.subscribe((ev) => {
    system.run(() => {
        commandBuilder.handleChatMessage(ev.message, ev.sender);
    });
    if(ev.message.startsWith(prefix))return ev.cancel = true;

});
