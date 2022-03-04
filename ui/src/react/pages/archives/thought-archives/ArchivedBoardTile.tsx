import * as React from 'react';
import moment from 'moment';

import Board from '../../../types/Board';

import './ArchivedBoardTile.scss';

interface Props {
  board: Board;
  onTileClicked(board: Board): void;
}

function ArchivedBoardTile({ board, onTileClicked }: Props): JSX.Element {
  return (
    <li data-testid="boardArchive" className="archived-board-tile">
      <span className="thought-count">{board.thoughts.length}</span>
      <span className="date">{moment(board.dateCreated).format('MMMM Do, yyyy')}</span>
      <button className="view-button" onClick={() => onTileClicked(board)}>
        View
      </button>
    </li>
  );
}

export default ArchivedBoardTile;
