import { Message } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');
import axios from 'axios';

import { Command } from '@v9v/nodejs-bot-engine';
import { error } from '../views/error';

const JOKE_API_URL = 'https://icanhazdadjoke.com';

const hi: Command = {
    name: 'hi',
    trigger: /^hi$/i,

    reaction: (bot: TelegramBot) => async (msg: Message, match: RegExpExecArray) => {
        try {
            const { data: joke } = await axios.get(JOKE_API_URL, {
                headers: { Accept: 'text/plain' },
            });

            bot.sendMessage(msg.chat.id, joke);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default hi;
