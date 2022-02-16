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
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import BoardService from '../../services/api/BoardService';
import { TeamState } from '../../state/TeamState';
import Team from '../../types/Team';
import { ModalMethods } from '../modal/Modal';

import ArchiveRetroDialog, { ArchiveRetroDialogRenderer } from './ArchiveRetroDialog';

jest.mock('../../services/api/BoardService');

describe('ArchiveRetroDialog', () => {
  const ref = React.createRef<ModalMethods>();

  beforeEach(() => {
    render(
      <RecoilRoot>
        <ArchiveRetroDialog ref={ref} />
      </RecoilRoot>
    );

    act(() => {
      ref.current.show();
    });
  });

  it('should show and hide from ref methods', () => {
    const archiveRetroModalTitle = 'Do you want to end the retro for everybody?';
    const archiveRetroModalSubtitle = 'This will permanently archive all thoughts!';
    screen.getByText(archiveRetroModalTitle);
    screen.getByText(archiveRetroModalSubtitle);

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText(archiveRetroModalTitle)).toBeFalsy();
  });
});

describe('ArchiveRetroDialogRenderer', () => {
  const mockCloseModalCallback = jest.fn();
  const team: Team = {
    name: 'My Team',
    id: 'fake-team-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(TeamState, team);
        }}
      >
        <ArchiveRetroDialogRenderer closeModal={mockCloseModalCallback} />
      </RecoilRoot>
    );
  });

  it('should archive retro', async () => {
    userEvent.click(screen.getByText('Yes!'));

    await act(async () => expect(BoardService.archiveRetro).toHaveBeenCalledWith(team.id));
    expect(mockCloseModalCallback).toHaveBeenCalledTimes(1);
  });

  it('should cancel archiving retro', () => {
    userEvent.click(screen.getByText('Nope'));

    expect(mockCloseModalCallback).toHaveBeenCalledTimes(1);
    expect(BoardService.archiveRetro).not.toHaveBeenCalled();
  });
});
