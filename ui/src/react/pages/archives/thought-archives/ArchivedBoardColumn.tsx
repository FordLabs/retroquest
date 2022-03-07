import * as React from 'react';

import { Column } from '../../../types/Column';
import Thought from '../../../types/Thought';

import './ArchivedBoardColumn.scss';

interface ColumnProps {
  column: Column;
  thoughts: Thought[];
}

interface ThoughtProps {
  thought: Thought;
}

function ArchivedBoardThought({ thought }: ThoughtProps): JSX.Element {
  return (
    <li data-testid={'thought' + thought.id} className="archived-thought">
      <p className="message">{thought.message}</p>
      <div className="footer">
        <p className="hearts">{thought.hearts}</p>
        <p className="is-discussed">{thought.discussed ? 'Discussed' : 'Not Discussed'}</p>
      </div>
    </li>
  );
}

function ArchivedBoardColumn({ column, thoughts }: ColumnProps): JSX.Element {
  return (
    <div data-testid="archived-column" className="archived-column">
      <h2>{column.title}</h2>
      <p>{thoughts.length}</p>
      <ol>
        {thoughts.map((thought) => {
          return <ArchivedBoardThought key={'thought' + thought.id} thought={thought} />;
        })}
      </ol>
    </div>
  );
}

export default ArchivedBoardColumn;
