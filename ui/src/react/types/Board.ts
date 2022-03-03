import Thought from './Thought';

interface Board {
  id: number;
  teamId: string;
  dateCreated: Date;
  thoughts: Thought[];
}

export default Board;
