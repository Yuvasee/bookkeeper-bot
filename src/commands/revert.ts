import Command from '../interfaces/Command';
import Transaction from '../models/Transaction';
import { error } from "../views/error";
import { transaction } from "../views/transaction";

const revert: Command = {
    re: /^revert$/,

    cb: (ctx, next) => {
        Transaction.find()
            .sort({ createdAt: -1 })
            .findOneAndDelete((err, t) => {
                if (err) {
                    ctx.replyWithHTML(error(err));
                }

                ctx.replyWithHTML(transaction(t) + '\n<b>Deleted</b>');
            });

        next();
    },
};

export default revert;
