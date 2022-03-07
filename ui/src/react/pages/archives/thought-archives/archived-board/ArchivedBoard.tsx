import * as React from 'react';

import Board from '../../../../types/Board';
import { Column } from '../../../../types/Column';
import Thought from '../../../../types/Thought';

import ArchivedBoardColumn from './archived-board-column/ArchivedBoardColumn';

import './ArchivedBoard.scss';

interface Props {
  board: Board;
}

function ArchivedBoard({ board }: Props): JSX.Element {
  function getThoughts(board: Board, column: Column): Thought[] {
    const columnSpecificThoughts = board.thoughts.filter((thought) => thought.topic === column.topic);
    const discussedThoughts = columnSpecificThoughts
      .filter((thought) => thought.discussed)
      .sort((a, b) => b.hearts - a.hearts);
    const notDiscussedThoughts = columnSpecificThoughts
      .filter((thought) => !thought.discussed)
      .sort((a, b) => b.hearts - a.hearts);
    return notDiscussedThoughts.concat(discussedThoughts);
  }

  return (
    <div className="archived-board">
      {board.columns.map((column) => {
        return <ArchivedBoardColumn key={column.id} column={column} thoughts={getThoughts(board, column)} />;
      })}
    </div>
  );
}

export default ArchivedBoard;
