import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

export const CURRENCIES = ['RUB', 'USD', 'EUR'] as const;

const rateToIlsSchema = createSchema({
    date: Type.string(),
    currency: Type.string({ enum: CURRENCIES }),
    rate: Type.number(),
});

export default typedModel('Rate', rateToIlsSchema);
export type RateToIlsDoc = ExtractDoc<typeof rateToIlsSchema>;
export type RateToIlsProps = ExtractProps<typeof rateToIlsSchema>;
