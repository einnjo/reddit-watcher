import util from 'util';

export const wait = util.promisify(setTimeout);
