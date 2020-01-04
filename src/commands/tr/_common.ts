import { TransactionProps } from '../../models/Transaction';

export function matchOrDefault(str: string, re: RegExp, def?: string) {
    const result = str.match(re);
    return result ? result[1] : def;
}

export function parseSum(input: string): number {
    const match = input.match(/^-\d+(?:[.,]\d+)?(?:[+\-*\/]\d+(?:[.,]\d+)?)*/);
    if (!match) {
        return;
    }
    const sumExpression = match[0].replace(/,/g, '.').slice(1);
    return Math.round(eval(sumExpression) * 100) / 100;
}

export function parseDate(text: string) {
    const dt = new Date(matchOrDefault(text, /@([^\s]+)/));
    return dt.toString() === 'Invalid Date' ? undefined : dt;
}

export function parseCurrency(text: string) {
    let cur = matchOrDefault(text, /\s\$([a-zA-Z]{3})/);
    if (cur) {
        cur = cur.toUpperCase();
    }
    return cur;
}

export function parseCat(text: string) {
    return matchOrDefault(text, /\:(\w+)/);
}

export function parseTags(text: string) {
    let result = text.match(/#\w+/g);
    if (result) {
        result = result.map(v => v.slice(1));
    }
    return result || [];
}

export function parseDescription(text: string) {
    return matchOrDefault(text, /\s([\w\s]+)/);
}

export function parseTransaction(text: string, defaultValues: Partial<TransactionProps> = {}) {
    return {
        sum: parseSum(text) || defaultValues.sum,
        date: parseDate(text) || defaultValues.date,
        currency: parseCurrency(text) || defaultValues.currency,
        category: parseCat(text) || defaultValues.category,
        tags: parseTags(text) || defaultValues.tags,
        description: parseDescription(text) || defaultValues.description,
        actor: defaultValues.actor,
    } as Partial<TransactionProps>;
}
