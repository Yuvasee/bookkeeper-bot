import CommandSet from '../../interfaces/CommandSet';

import fallback from './fallback';
import ls from './ls';

export const trSet: CommandSet = {
    name: 'tr',
    commands: { ls },
    fallback,
};

export default trSet;
