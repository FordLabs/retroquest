import * as React from 'react';
import { useRecoilState } from 'recoil';

import { ArchivedBoardState } from '../../../state/ArchivedBoardState';

import ArchivedBoard from './archived-board/ArchivedBoard';
import ArchivedBoardsList from './archived-boards-list/ArchivedBoardsList';

function ThoughtArchives(): JSX.Element {
  const [selectedArchivedBoard, setSelectedArchivedBoard] = useRecoilState(ArchivedBoardState);

  return selectedArchivedBoard ? (
    <ArchivedBoard board={selectedArchivedBoard} />
  ) : (
    <ArchivedBoardsList onBoardSelection={setSelectedArchivedBoard} />
  );
}

export default ThoughtArchives;
