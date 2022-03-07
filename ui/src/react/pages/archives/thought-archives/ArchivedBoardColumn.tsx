import * as React from 'react';

import ColumnHeader from '../../../components/column-header/ColumnHeader';
import { CountSeparator } from '../../../components/count-separator/CountSeparator';
import UpvoteCount from '../../../components/upvote-count/UpvoteCount';
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
        <UpvoteCount votes={thought.hearts} />
        <p className="is-discussed">{thought.discussed ? 'Discussed' : 'Not Discussed'}</p>
      </div>
    </li>
  );
}

function ArchivedBoardColumn({ column, thoughts }: ColumnProps): JSX.Element {
  return (
    <div data-testid="archived-column" className="archived-column">
      <ColumnHeader initialTitle={column.title} type={column.topic} />
      <CountSeparator count={thoughts.length} />
      <ol>
        {thoughts.map((thought) => {
          return <ArchivedBoardThought key={'thought' + thought.id} thought={thought} />;
        })}
      </ol>
    </div>
  );
}

export default ArchivedBoardColumn;
