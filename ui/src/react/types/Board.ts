import { Column } from './Column';
import Thought from './Thought';

interface Board {
  id: number;
  teamId: string;
  dateCreated: Date;
  thoughts: Thought[];
  columns: Column[];
}

export default Board;
