import TelegramBot = require('node-telegram-bot-api');
import Command from './interfaces/Command';
import CommandSet from './interfaces/CommandSet';

interface Bot {
    api: TelegramBot;
    registeredCommands: Set<string>;
    registerCommand: (command: Command) => Bot;
    registerCommandSet: (commandSet: CommandSet) => Bot;
    registerFallback: () => Bot;
}

export function createBot(api: TelegramBot): Bot {
    const bot: Bot = {
        api,

        registeredCommands: new Set<string>([]),

        registerCommand(this: Bot, command: Command) {
            if (this.registeredCommands.has(command.name)) {
                throw new Error(`Command names collision occured: ${command.name}. Commands should have unique names.`);
            }

            command.trigger && this.api.onText(command.trigger, command.reaction(this.api));
            this.registeredCommands.add(command.name);
            console.log('Registered command: ' + command.name);

            return this;
        },

        registerCommandSet(this: Bot, commandSet: CommandSet) {
            const { name: setName, commands, fallback } = commandSet;
            const commandNames = Object.keys(commands);

            if (this.registeredCommands.has(setName)) {
                throw new Error(`Command names collision occured: ${setName}. Commands should have unique names.`);
            }
            this.registeredCommands.add(setName);

            console.log(`Command set: ${setName} ---`);

            commandNames.forEach(commandName => {
                // matches "setName commandName..."
                const reKnownCmd = `^${setName}[ \\t]+${commandName}([ \\t]+.*)?$`;
                commands[commandName].trigger = new RegExp(reKnownCmd);
                this.registerCommand(commands[commandName]);
            });

            // matches "setName" and "setName not(one|of|commandNames)..."
            const reFallbackCmd = `^${setName}(?!\\S|([ \\t]+)?(${commandNames.join('|')}))`;
            fallback.trigger = new RegExp(reFallbackCmd);
            this.registerCommand(fallback);

            console.log(`---`);

            return this;
        },

        registerFallback(this: Bot) {
            // matches minus command
            const reMinusSum = '-\\d+(?:[.,]\\d+)?(?:[+\\-*\\/]\\d+(?:[.,]\\d+)?)*';
            const commands = [...this.registeredCommands];
            const commandsJoined = commands.join('|');

            // matches all but valid commands
            const reFallbackGlobal = `^(?!(${reMinusSum}|${commandsJoined})).+|^(${commandsJoined})\\w+.*`;

            this.registerCommand({
                name: 'global fallback',

                trigger: new RegExp(reFallbackGlobal),

                reaction: botApi => (msg, match) => {
                    botApi.sendMessage(msg.chat.id, `commands: \n${commands.join('\n')}`);
                },
            });

            return this;
        },
    };

    return bot;
}
