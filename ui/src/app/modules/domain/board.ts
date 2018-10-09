import * as moment from 'moment';
import {emptyThoughtWithColumn, Thought} from './thought';

export class Board {
  id: number;
  dateCreated: moment.Moment;
  teamId: string;
  thoughts: Array<Thought>;
}

export function emptyBoardWithThought (): Board {
  const board = new Board();
  board.dateCreated = moment();
  board.id = -1;
  board.teamId = '';
  board.thoughts = [emptyThoughtWithColumn()];
  return board;
}
