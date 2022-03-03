import * as React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import BoardService from '../../../services/api/BoardService';
import { TeamState } from '../../../state/TeamState';
import Team from '../../../types/Team';

import ThoughtArchives from './ThoughtArchives';

jest.mock('../../../services/api/BoardService');

describe('Thought Archives', () => {
  it('should display a list of completed retros', async () => {
    await setUpThoughtArchives();
    screen.getByText('October 1st, 1982');
    screen.getByText('April 22nd, 1998');
  });

  it('should be sorted by date by default', async () => {
    await setUpThoughtArchives();
    const tiles = screen.getAllByTestId('boardArchive');
    expect(within(tiles[0]).queryByText('October 1st, 1982')).not.toBeNull();
    expect(within(tiles[1]).queryByText('April 22nd, 1998')).not.toBeNull();
  });

  it('should show "No Archives" message when no archived thoughts are present', async () => {
    BoardService.getBoards = jest.fn().mockResolvedValue([]);

    await act(async () => {
      render(
        <RecoilRoot>
          <ThoughtArchives />
        </RecoilRoot>
      );
    });

    screen.getByText('No archives were found.');
    const description = screen.getByTestId('noArchivesFoundSectionDescription');
    expect(description.innerHTML).toBe('Boards will appear when retros are ended with <b>thoughts</b>.');
  });
});

const setUpThoughtArchives = async () => {
  await act(async () => {
    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(TeamState, { id: 'teamId' } as unknown as Team);
        }}
      >
        <ThoughtArchives />
      </RecoilRoot>
    );
  });
};
