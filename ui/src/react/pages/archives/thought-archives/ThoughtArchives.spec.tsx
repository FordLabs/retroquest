import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { TeamState } from '../../../state/TeamState';
import Team from '../../../types/Team';

import ThoughtArchives from './ThoughtArchives';

jest.mock('../../../services/api/BoardService');

describe('Thought Archives', () => {
  it('should display Archived Boards List by default', async () => {
    await setUpThoughtArchives();
    expect(screen.queryByText('Thought Archives')).not.toBeNull();
  });

  it('should display board when selected', async () => {
    await setUpThoughtArchives();
    fireEvent.click(screen.getAllByText('View')[1]);
    expect(screen.queryByText('I am a message')).not.toBeNull();
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
