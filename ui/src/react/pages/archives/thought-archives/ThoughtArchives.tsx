import * as React from 'react';
import { useRecoilState } from 'recoil';

import { ArchivedBoardState } from '../../../state/ArchivedBoardState';

import ArchivedBoard from './ArchivedBoard';
import ArchivedBoardsList from './ArchivedBoardsList';

function ThoughtArchives(): JSX.Element {
  const [selectedArchivedBoard, setSelectedArchivedBoard] = useRecoilState(ArchivedBoardState);

  return selectedArchivedBoard ? (
    <ArchivedBoard board={selectedArchivedBoard} />
  ) : (
    <ArchivedBoardsList onBoardSelection={setSelectedArchivedBoard} />
  );
}

export default ThoughtArchives;
