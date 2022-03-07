/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
