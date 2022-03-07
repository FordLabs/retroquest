import { atom } from 'recoil';

import Board from '../types/Board';

export const ArchivedBoardState = atom<Board>({
  key: 'ArchivedBoardState',
  default: undefined,
});
