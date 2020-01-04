import CommandSet from '../../interfaces/CommandSet';

import fallback from './fallback';
import ls from './ls';
import alt from './alt';

export const trSet: CommandSet = {
    name: 'tr',
    commands: { ls, alt },
    fallback,
};

export default trSet;
