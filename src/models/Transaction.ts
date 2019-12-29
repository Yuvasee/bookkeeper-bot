import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

import { CURRENCIES } from './Rate';

const CURRENCIES_WITH_ILS = [...CURRENCIES, 'ILS'];

const transactionSchema = createSchema(
    {
        sum: Type.number(),
        date: Type.date(),
        actor: Type.string(),
        currency: Type.string({
            default: 'ILS',
            enum: CURRENCIES_WITH_ILS,
        }),
        category: Type.string(),
        tags: Type.array().of(Type.string()),
        description: Type.string({ required: false }),
    },
    {
        timestamps: true,
    },
);

export default typedModel('Transaction', transactionSchema);
export type TransactionDoc = ExtractDoc<typeof transactionSchema>;
export type TransactionProps = ExtractProps<typeof transactionSchema>;
