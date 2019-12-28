import CommandSet from '../../interfaces/CommandSet';

import list from './list';
import merge from './merge';
import fallback from './fallback';

export const catsSet: CommandSet = {
    name: 'cats',
    commands: { list, merge },
    fallback,
};

export default catsSet;
