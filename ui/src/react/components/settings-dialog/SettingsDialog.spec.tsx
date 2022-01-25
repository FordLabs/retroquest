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

import Theme from '../../types/Theme';
import { ModalMethods } from '../modal/Modal';

import SettingsDialog, { SettingsDialogRenderer } from './SettingsDialog';

describe('SettingsDialog', () => {
  const ref = React.createRef<ModalMethods>();

  beforeEach(() => {
    render(
      <RecoilRoot>
        <SettingsDialog ref={ref} />
      </RecoilRoot>
    );

    act(() => {
      ref.current.show();
    });
  });

  it('should show and hide from ref methods', () => {
    screen.getByText('Settings');
    screen.getByText('choose your preferences');

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText('Settings')).toBeFalsy();
  });
});

describe('SettingsDialogRenderer', () => {
  const mockOnThemeChange = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    render(<SettingsDialogRenderer theme={Theme.LIGHT} onThemeChange={mockOnThemeChange} onLogout={mockOnLogout} />);
  });

  it('should logout', () => {
    userEvent.click(screen.getByText('Account'));
    userEvent.click(screen.getByText('Logout'));

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('should change to light theme', () => {
    userEvent.click(screen.getByText('Appearance'));
    userEvent.click(screen.getByAltText('Light Theme'));

    expect(mockOnThemeChange).toHaveBeenCalledWith(Theme.LIGHT);
  });

  it('should change to dark theme', () => {
    userEvent.click(screen.getByText('Appearance'));
    userEvent.click(screen.getByAltText('Dark Theme'));

    expect(mockOnThemeChange).toHaveBeenCalledWith('dark-theme');
  });
});
