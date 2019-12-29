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

    return `<pre>${format(new Date(), 'MMMM YYYY')}:\n${strTransactions.join('\n')}</pre>`;
}

export default transactionListView;
