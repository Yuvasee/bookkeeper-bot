import CommandSet from '../../interfaces/CommandSet';

import ls from './ls';
import merge from './merge';
import fallback from './fallback';

export const catsSet: CommandSet = {
    name: 'cats',
    commands: { ls, merge },
    fallback,
};

export default catsSet;
