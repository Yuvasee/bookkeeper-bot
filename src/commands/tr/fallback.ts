import Command from '../../interfaces/Command';
import { error } from '../../views/error';

const text = `
new transaction:
-nn[(.|,)nn][:<cat>][ #<tag>]*[ $<currency][ @mm/dd/yyyy][ <description>]
-12,3:food
-12,3:food #greens #auchan $usd @10/19/2019 just some food for evening

list month transactions:
tr ls [[-]mm[ yyyy]]
tr ls 11
tr ls -1
tr ls 10 2018

alter transaction:
tr alt <id> [-nn[(.|,)nn]][ :<cat>][ #<tag>]*[ $<currency][ @mm/dd/yyyy][ <description>]
tr alt 5e10c7b1b8d9734e67b048ab :food $usd
tr alt 5e10c7b1b8d9734e67b048ab -12,3:food #greens just some food for evening

remove transaction
tr rm <id>
tr rm 5e10c7b1b8d9734e67b048ab
`;

const trFallback: Command = {
    name: 'tr fallback docs',
    reaction: bot => async (msg, match) => {
        try {
            bot.sendMessage(msg.chat.id, text);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default trFallback;
