import { CommandSet } from '@v9v/nodejs-bot-engine';

import fallback from './fallback';
import ls from './ls';
import alt from './alt';
import rm from './rm';

export const trSet: CommandSet = {
    name: 'tr',
    commands: { ls, alt, rm },
    fallback,
};

export default trSet;
