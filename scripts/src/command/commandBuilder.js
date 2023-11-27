import { world, system } from "@minecraft/server";
import { prefix } from "../../config";
import { error, state } from "../../text/en-US";
import { language } from "../../text/languageHandler";

class CommandBuilder {
    constructor() {
        this.commands = new Map();
    }

    registerCommand(command, description, handler) {
        this.commands.set(command, { description, handler });
    }

    handleChatMessage(msg, actor) {
        try {
            if (msg.startsWith(prefix)) {
                const args = msg.slice(prefix.length).trim().split(/\s+/);
                const command = args.shift();

                if (this.commands.has(command)) {
                    if (actor && actor.isOp()) {
                        const { handler } = this.commands.get(command);
                        this.commands
                            .get(command)
                            .handler(msg, actor, command, args);
                    } else {
                        console.error(error.cantExecute, "command", actor);
                    }
                } else {
                    if (actor) {
                        actor.sendMessage(
                            language(error.unknownCommand, "command", command),
                        );
                    }
                }
            }
        } catch (err) {
            console.error("Error handling chat message:", err);
        }
    }

    getAllCommands() {
        const commandList = Array.from(this.commands.keys())
            .map(
                (command) =>
                    `§e${command}§a:§c ${
                        this.commands.get(command).description
                    }`,
            )
            .join(",\n"); // Use a comma and space as separators

        return commandList;
    }

    getCommand(command) {
        return this.commands.get(command);
    }
}

export const commandBuilder = new CommandBuilder();

world.beforeEvents.chatSend.subscribe((ev) => {
    if (!ev.sender.isOp()) return (ev.cancel = false);
    // ev.sender.location.x.toFixed(0.9);
    system.run(() => {
        commandBuilder.handleChatMessage(ev.message, ev.sender);
    });
    if (ev.message.startsWith(prefix)) return (ev.cancel = true);
});
