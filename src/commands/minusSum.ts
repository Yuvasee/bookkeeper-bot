import ICommand from '../interfaces/ICommand';
import Transaction from '../models/Transaction';
import { errorView, transactionView } from './_views';

function safeMatchOne(str, re, def = '') {
    const result = str.match(re);
    return result ? result[1] : def;
}

function matchTags(str) {
    let result = str.match(/#\w+/g);
    if (result) {
        result = result.map((v) => v.slice(1));
    }
    return result || [];
}

function parseDate(str) {
    const dt = new Date(str);
    return dt.toString() === 'Invalid Date' ? new Date() : dt;
}

const minusSum: ICommand = {
    re: /^-\d+(?:[.,]\d+)?(?:[+\-*]\d+(?:[.,]\d+)?)*/,

    cb: (ctx, next) => {
        const { text } = ctx.message;

        let sumExpression = text.match(/^-\d+(?:[.,]\d+)?(?:[+\-*]\d+(?:[.,]\d+)?)*/)[0];
        sumExpression = sumExpression.replace(',', '.').slice(1);

        const t = new Transaction({
            sum: eval(sumExpression),
            date: parseDate(safeMatchOne(text, /@([^\s]+)/)),
            actor: ctx.from.username,
            currency: safeMatchOne(text, /\s\$([A-Z]{3})\s/, 'ILS'),
            category: safeMatchOne(text, /\/(\w+)/, 'Unsorted'),
            tags: matchTags(text),
            description: safeMatchOne(text, /\s([\w\s]+)/).trim(),
        });

        ctx.replyWithHTML(transactionView(t));

        t.save((err) => {
            if (err) {
                ctx.replyWithHTML(errorView(err));
            }

            ctx.replyWithHTML(`<b>Saved ${t.get('sum')} for ${t.get('category')}</b>`);
        });

        next();
    },
};

export default minusSum;
