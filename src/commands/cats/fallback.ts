import Command from '../../interfaces/Command';
import { error } from '../../views/error';

const text = `
usage: cats <command>

commands:
list - view categories list in alphabet order
`;

const catsFallback: Command = {
    name: 'cats fallback docs',
    reaction: bot => async (msg, match) => {
        try {
            bot.sendMessage(msg.chat.id, text);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default catsFallback;
