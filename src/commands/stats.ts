import format = require('date-fns/format');
import { Message, ParseMode } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');

import Command from '../interfaces/Command';
import Rate from '../models/Rate';
import Transaction from '../models/Transaction';
import { error } from '../views/error';

const stats: Command = {
    name: 'stats',
    trigger: /^stats$/i,

    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => {
        // TODO: filter by date (monthes)

        // const { text } = msg;

        // let period = '';
        // const periodMatch = text.match(/^stats\s+([\d\w]+)\s?/);

        // if (periodMatch) {
        //     period = periodMatch[1];
        //     !period.match(/\d\d/) && Number(period) < 12;
        // } else {
        //     period = format(new Date(), 'MM');
        // }

        // Transaction.aggregate(
        //     [{ $group: { _id: '$category', sum: { $sum: '$sum' } } }, { $sort: { sum: -1 } }],
        //     (err: any, res: any) => {
        //         err && bot.sendMessage(msg.chat.id, error(err));
        //         bot.sendMessage(msg.chat.id, res);
        //     },
        // );
    },
};

export default stats;
