import { atom } from 'recoil';

import { Column } from '../types/Column';

export const ColumnsState = atom<Column[]>({
  key: 'ColumnsState',
  default: [],
});
