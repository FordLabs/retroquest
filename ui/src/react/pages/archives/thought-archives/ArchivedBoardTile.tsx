import * as React from 'react';
import moment from 'moment';

import Board from '../../../types/Board';

interface Props {
  board: Board;
}

function ArchivedBoardTile({ board }: Props): JSX.Element {
  return (
    <li>
      <span>{board.thoughts.length}</span>
      <span>{moment(board.dateCreated).format('MMMM Do, yyyy')}</span>
      <button>View</button>
    </li>
  );
}

export default ArchivedBoardTile;
