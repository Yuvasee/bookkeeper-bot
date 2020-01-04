import { TransactionDoc } from '../models/Transaction';

export function transaction(t: TransactionDoc) {
    return (
        `<b>Transaction -${t.sum} ${t.currency} saved:</b>` +
        `\nid: ${t.id}` +
        `\ndate: ${t.date.toDateString()}` +
        `\nactor: ${t.actor}` +
        `\ncategory: ${t.category}` +
        `\ntags: ${t.tags.join(', ')}` +
        `\ndescription: ${t.description}`
    );
}
