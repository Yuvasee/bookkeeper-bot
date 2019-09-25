import Command from '../interfaces/Command';
import Transaction from '../models/Transaction';
import { error } from '../views/error';
import { transaction } from '../views/transaction';

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

const minusSum: Command = {
    re: /^-\d+(?:[.,]\d+)?(?:[+\-*]\d+(?:[.,]\d+)?)*/,

    cb: (ctx, next) => {
        const { text } = ctx.message;

        let sumExpression = text.match(/^-\d+(?:[.,]\d+)?(?:[+\-*]\d+(?:[.,]\d+)?)*/)[0];
        sumExpression = sumExpression.replace(/,/g, '.').slice(1);

        const t = new Transaction({
            sum: Math.round(eval(sumExpression) * 100) / 100,
            date: parseDate(safeMatchOne(text, /@([^\s]+)/)),
            actor: ctx.from.username,
            currency: safeMatchOne(text, /\s\$([A-Z]{3})/, 'ILS'),
            category: safeMatchOne(text, /\/(\w+)/, 'Unsorted'),
            tags: matchTags(text),
            description: safeMatchOne(text, /\s([\w\s]+)/).trim(),
        });

        ctx.replyWithHTML(transaction(t));

        t.save((err) => {
            if (err) {
                ctx.replyWithHTML(error(err));
            }

            ctx.replyWithHTML(`<b>Saved ${t.get('sum')} for ${t.get('category')}</b>`);
        });

        next();
    },
};

export default minusSum;
