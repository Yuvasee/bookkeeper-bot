import Command from '../../interfaces/Command';
import { error } from '../../views/error';

const text = `
usage: tr <command>

commands:
list [mm[ yyyy]] - view transactions list for current or specified month
update <id> <new minus command> - update transaction
delete <id> - delete transaction
`;

const trFallback: Command = {
    name: 'tr fallback docs',
    reaction: bot => async (msg, match) => {
        try {
            bot.sendMessage(msg.chat.id, text);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default trFallback;
