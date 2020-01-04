import { format } from 'date-fns';

import { TransactionDoc } from '../models/Transaction';
import { alignAndExtendStrArray } from './utils';

export function transactionListView(transactions: TransactionDoc[]) {
    let strTransactions = transactions.map(tr => {
        let str = '';
        str += format(tr.date, 'DD/MM');
        str += ` -${tr.sum}`;
        return str;
    });

    strTransactions = alignAndExtendStrArray(strTransactions, transactions, tr => {
        let str = `${tr.currency} ${tr.category}`;
        str += tr.tags.map(t => ' #' + t).join('');
        str += tr.description ? ` (${tr.description})` : '';
        return str;
    });

    strTransactions = alignAndExtendStrArray(strTransactions, transactions, tr => {
        return `id ${tr.id}`;
    });

    const chunks = strTransactions.reduce(
        (acc, v) => {
            if ((acc[acc.length - 1] + v).length <= 4000) {
                acc[acc.length - 1] += `\n${v}`;
            } else {
                acc.push(`\n${v}`);
            }
            return acc;
        },
        [''] as string[],
    );

    return chunks.map(
        (ch, n) => `<pre>${format(transactions[0].date, 'MMMM YYYY')} (${n + 1}/${chunks.length}):${ch}</pre>`,
    );
}

export default transactionListView;
