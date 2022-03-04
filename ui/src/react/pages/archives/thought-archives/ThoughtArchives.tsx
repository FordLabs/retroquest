import * as React from 'react';
import { useState } from 'react';

import Board from '../../../types/Board';

import ArchivedBoard from './ArchivedBoard';
import ArchivedBoardsList from './ArchivedBoardsList';

function ThoughtArchives(): JSX.Element {
  const [selectedArchivedBoard, setSelectedArchivedBoard] = useState<Board>();

  return selectedArchivedBoard ? (
    <ArchivedBoard board={selectedArchivedBoard} />
  ) : (
    <ArchivedBoardsList onBoardSelection={setSelectedArchivedBoard} />
  );
}

export default ThoughtArchives;
