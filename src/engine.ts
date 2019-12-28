import TelegramBot = require('node-telegram-bot-api');
import Command from './interfaces/Command';
import CommandSet from './interfaces/CommandSet';

export function registerCommand(bot: TelegramBot, command: Command) {
    command.trigger && bot.onText(command.trigger, command.reaction(bot));

    console.log('Registered command: ' + command.name);
}

export function registerCommandSet(bot: TelegramBot, commandSet: CommandSet) {
    const { name: setName, commands, fallback } = commandSet;
    const commandNames = Object.keys(commands);

    console.log(`Command set: ${commandSet.name} ---`);

    commandNames.forEach(commandName => {
        // matches "setName commandName..."
        const reKnownCmd = `^${setName}[ \\t]+${commandName}([ \\t]+.*)?$`;
        commands[commandName].trigger = new RegExp(reKnownCmd);
        registerCommand(bot, commands[commandName]);
    });

    // matches "setName" and "setName not(one|of|commandNames)..."
    const reFallbackCmd = `^${setName}(?!\\S|([ \\t]+)?(${commandNames.join('|')}))`;
    fallback.trigger = new RegExp(reFallbackCmd);
    registerCommand(bot, fallback);

    console.log(`---`);
}
