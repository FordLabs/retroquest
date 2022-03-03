import * as React from 'react';
import moment from 'moment';

import Board from '../../../types/Board';

import './ArchivedBoardTile.scss';

interface Props {
  board: Board;
}

function ArchivedBoardTile({ board }: Props): JSX.Element {
  return (
    <li data-testid="boardArchive" className="archived-board-tile">
      <span className="thought-count">{board.thoughts.length}</span>
      <span className="date">{moment(board.dateCreated).format('MMMM Do, yyyy')}</span>
      <button className="view-button">View</button>
    </li>
  );
}

export default ArchivedBoardTile;
