import * as React from 'react';
import { render, screen, within } from '@testing-library/react';

import Board from '../../../../types/Board';
import Topic from '../../../../types/Topic';

import ArchivedBoard from './ArchivedBoard';

describe('Archived Board', () => {
  it('should display columns', () => {
    render(<ArchivedBoard board={testBoard} />);
    const columns = screen.getAllByTestId('archived-column');
    expect(within(columns[0]).queryByText('Happy')).not.toBeNull();
    expect(within(columns[1]).queryByText('Sad')).not.toBeNull();
  });

  it('should display thoughts for column', () => {
    render(<ArchivedBoard board={testBoard} />);
    const columns = screen.getAllByTestId('archived-column');
    expect(within(columns[0]).queryByText('I am a message4')).not.toBeNull();
    expect(within(columns[0]).queryByText('I am a message1')).not.toBeNull();
    expect(within(columns[1]).queryByText('I am a message2')).not.toBeNull();
    expect(within(columns[1]).queryByText('I am a message3')).not.toBeNull();
  });

  it('should display number of thoughts per column', () => {
    render(<ArchivedBoard board={testBoard} />);
    const columns = screen.getAllByTestId('archived-column');
    expect(within(columns[0]).queryByText('2')).not.toBeNull();
    expect(within(columns[1]).queryByText('2')).not.toBeNull();
  });

  it('should display thought heart count', () => {
    render(<ArchivedBoard board={testBoard} />);
    const thought = screen.getByTestId('thought100');
    expect(within(thought).queryByText('20')).not.toBeNull();
  });

  it('should display Not Discussed if thought was not discussed', () => {
    render(<ArchivedBoard board={testBoard} />);
    const thought = screen.getByTestId('thought100');
    expect(within(thought).queryByText('Not Discussed')).not.toBeNull();
  });

  it('should display Discussed if thought was discussed', () => {
    render(<ArchivedBoard board={testBoard} />);
    const thought = screen.getByTestId('thought102');
    expect(within(thought).queryByText('Discussed')).not.toBeNull();
  });

  it('should display thoughts in order by discussion status and then thought count', () => {
    render(<ArchivedBoard board={singleColumnTestBoard} />);
    const thoughts = screen.getAllByTestId(/thought/);
    expect(within(thoughts[0]).queryByText('I am a message4')).not.toBeNull();
    expect(within(thoughts[1]).queryByText('I am a message1')).not.toBeNull();
    expect(within(thoughts[2]).queryByText('I am a message2')).not.toBeNull();
    expect(within(thoughts[3]).queryByText('I am a message3')).not.toBeNull();
  });
});

const testBoard: Board = {
  dateCreated: new Date(),
  id: 1,
  teamId: '',
  thoughts: [
    {
      id: 100,
      message: 'I am a message1',
      hearts: 20,
      discussed: false,
      topic: Topic.HAPPY,
    },
    {
      id: 101,
      message: 'I am a message2',
      hearts: 30,
      discussed: false,
      topic: Topic.UNHAPPY,
    },
    {
      id: 102,
      message: 'I am a message3',
      hearts: 10,
      discussed: true,
      topic: Topic.UNHAPPY,
    },
    {
      id: 103,
      message: 'I am a message4',
      hearts: 10,
      discussed: false,
      topic: Topic.HAPPY,
    },
  ],
  columns: [
    {
      id: 10,
      title: 'Happy',
      topic: Topic.HAPPY,
    },
    {
      id: 11,
      title: 'Sad',
      topic: Topic.UNHAPPY,
    },
  ],
};

const singleColumnTestBoard: Board = {
  dateCreated: new Date(),
  id: 1,
  teamId: '',
  thoughts: [
    {
      id: 100,
      message: 'I am a message1',
      hearts: 10,
      discussed: false,
      topic: Topic.HAPPY,
    },
    {
      id: 101,
      message: 'I am a message2',
      hearts: 30,
      discussed: true,
      topic: Topic.HAPPY,
    },
    {
      id: 102,
      message: 'I am a message3',
      hearts: 10,
      discussed: true,
      topic: Topic.HAPPY,
    },
    {
      id: 103,
      message: 'I am a message4',
      hearts: 20,
      discussed: false,
      topic: Topic.HAPPY,
    },
  ],
  columns: [
    {
      id: 10,
      title: 'Happy',
      topic: Topic.HAPPY,
    },
  ],
};
