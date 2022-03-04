import * as React from 'react';

import Board from '../../../types/Board';

interface Props {
  board: Board;
}

function ArchivedBoard({ board }: Props): JSX.Element {
  return (
    <div>
      {board.thoughts.map((board) => {
        return <p key={board.id}>{board.message}</p>;
      })}
    </div>
  );
}

export default ArchivedBoard;
