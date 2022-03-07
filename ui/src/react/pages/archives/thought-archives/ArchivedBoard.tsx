import * as React from 'react';

import Board from '../../../types/Board';

import ArchivedBoardColumn from './ArchivedBoardColumn';

interface Props {
  board: Board;
}

function ArchivedBoard({ board }: Props): JSX.Element {
  return (
    <div>
      {board.columns.map((column) => {
        return (
          <ArchivedBoardColumn
            key={column.id}
            column={column}
            thoughts={board.thoughts.filter((thought) => thought.topic === column.topic)}
          />
        );
      })}
    </div>
  );
}

export default ArchivedBoard;
