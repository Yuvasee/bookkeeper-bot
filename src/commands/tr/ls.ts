import { startOfMonth, endOfMonth, getMonth, getYear, subMonths } from 'date-fns';
import { ParseMode } from 'node-telegram-bot-api';

import Command from '../../interfaces/Command';
import Transaction from '../../models/Transaction';
import { error } from '../../views/error';
import transactionListView from '../../views/transactionList';

const trLs: Command = {
    name: 'tr ls',

    reaction: bot => async (msg, match) => {
        const { text } = msg;

        const innerMatch = text.match(/^tr\s+ls\s+(-?\d{1,2})(?:\s+(\d{4}))?\s*/);
        const monthMatch = Number(innerMatch[1]);
        const yearMatch = Number(innerMatch[2]);

        const [month, year] = getMonthYearFromMatch(monthMatch, yearMatch);
        const [start, end] = getStartEnd(month, year);

        try {
            const transactions = await Transaction.find()
                .where('date')
                .gte(start)
                .lte(end);

            const message = transactionListView(transactions);

            const options = { parse_mode: 'HTML' as ParseMode };

            bot.sendMessage(msg.chat.id, message, options);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

function getMonthYearFromMatch(monthMatch: number, yearMatch: number): [number, number] {
    const now = new Date();
    // Default month is currect
    let baseDate = now;
    let month = 0;
    let year = 0;

    // -n from current month
    if (monthMatch <= 0) {
        baseDate = subMonths(now, -monthMatch);
    } else if (monthMatch <= 12 && yearMatch) {
        // exact month
        month = monthMatch - 1;
        // exact year or current year by default
        year = yearMatch || (monthMatch <= getMonth(now) ? getYear(now) : getYear(now) - 1);
    }

    month = month || getMonth(baseDate);
    year = year || getYear(baseDate);

    return [month, year];
}

function getStartEnd(month: number, year: number): [Date, Date] {
    const baseDate = new Date(year, month);
    return [startOfMonth(baseDate), endOfMonth(baseDate)];
}

export default trLs;
