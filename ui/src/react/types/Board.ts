import moment from 'moment';

import Thought from './Thought';

interface Board {
  id: number;
  teamId: string;
  dateCreated: moment.Moment;
  thoughts: Thought[];
}

export default Board;
