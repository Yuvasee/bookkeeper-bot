import { Message, ParseMode } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');

import Command from '../interfaces/Command';
import Transaction from '../models/Transaction';
import { error } from '../views/error';
import { transaction } from '../views/transaction';

const minusSum: Command = {
    trigger: /^-\d+(?:[.,]\d+)?(?:[+\-*]\d+(?:[.,]\d+)?)*/,

    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => {
        const { text } = msg;

        let sumExpression = text.match(/^-\d+(?:[.,]\d+)?(?:[+\-*]\d+(?:[.,]\d+)?)*/)[0];
        sumExpression = sumExpression.replace(/,/g, '.').slice(1);

        const t = new Transaction({
            sum: Math.round(eval(sumExpression) * 100) / 100,
            date: parseDate(safeMatchOne(text, /@([^\s]+)/)),
            actor: msg.from.username,
            currency: safeMatchOne(text, /\s\$([A-Z]{3})/, 'ILS'),
            category: safeMatchOne(text, /\/(\w+)/, 'Unsorted'),
            tags: matchTags(text),
            description: safeMatchOne(text, /\s([\w\s]+)/).trim(),
        });

        const id = msg.chat.id;
        const options = { parse_mode: 'HTML' as ParseMode };

        bot.sendMessage(id, transaction(t), options);

        t.save((err: any) => {
            if (err) {
                bot.sendMessage(id, error(err), options);
            } else {
                bot.sendMessage(id, `<b>Saved ${t.get('sum')} for ${t.get('category')}</b>`, options);
            }
        });
    },
};
export default minusSum;

function safeMatchOne(str: string, re: RegExp, def = '') {
    const result = str.match(re);
    return result ? result[1] : def;
}

function matchTags(str: string) {
    let result = str.match(/#\w+/g);
    if (result) {
        result = result.map((v) => v.slice(1));
    }
    return result || [];
}

function parseDate(str: string) {
    const dt = new Date(str);
    return dt.toString() === 'Invalid Date' ? new Date() : dt;
}
