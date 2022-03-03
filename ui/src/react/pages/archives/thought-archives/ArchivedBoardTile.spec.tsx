import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { mockBoards } from '../../../services/api/__mocks__/BoardService';

import ArchivedBoardTile from './ArchivedBoardTile';

describe('Archived Board Tile', () => {
  it('should display the number of thoughts in a board', () => {
    render(<ArchivedBoardTile board={mockBoards[0]} />);
    screen.getByText('1');
  });

  it('should display the date the board was archived', () => {
    render(<ArchivedBoardTile board={mockBoards[0]} />);
    screen.getByText('October 1st, 1982');
  });

  it('should display view button', () => {
    render(<ArchivedBoardTile board={mockBoards[0]} />);
    screen.getByText('View');
  });
});
