import ICommand from '../interfaces/ICommand';
import Transaction from '../models/Transaction';
import { errorView, transactionView } from './_views';

const revert: ICommand = {
    re: /^revert$/,

    cb: (ctx, next) => {
        Transaction.find()
            .sort({ createdAt: -1 })
            .findOneAndDelete((err, t) => {
                if (err) {
                    ctx.replyWithHTML(errorView(err));
                }

                ctx.replyWithHTML(transactionView(t) + '\n<b>Deleted</b>');
            });

        next();
    },
};

export default revert;
