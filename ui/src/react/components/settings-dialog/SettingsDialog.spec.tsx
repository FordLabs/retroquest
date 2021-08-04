/*
 * Copyright (c) 2021 Ford Motor Company
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

import SettingsDialog, { SettingsDialogRenderer } from './SettingsDialog';
import Theme from '../../types/theme';
import Dialog from '../../types/dialog';

describe('SettingsDialog', () => {
  it('should show', () => {
    const ref = React.createRef<Dialog>();
    render(<SettingsDialog ref={ref} />);

    act(() => {
      ref.current.show();
    });

    screen.getByText('settings');
    screen.getByText('choose your preferences');

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText('settings')).toBeFalsy();
  });

  describe('SettingsDialogRenderer', () => {
    const mockOnThemeChange = jest.fn();
    const mockOnLogout = jest.fn();
    const mockOnHide = jest.fn();

    beforeEach(() => {
      render(
        <SettingsDialogRenderer
          theme={Theme.LIGHT}
          onThemeChange={mockOnThemeChange}
          onLogout={mockOnLogout}
          onHide={mockOnHide}
        />
      );

      jest.clearAllMocks();
    });

    it('should logout', () => {
      userEvent.click(screen.getByText('account'));
      userEvent.click(screen.getByText('logout'));

      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    it('should change to light theme', () => {
      userEvent.click(screen.getByText('appearance'));
      userEvent.click(screen.getByAltText('Light Theme'));

      expect(mockOnThemeChange).toHaveBeenCalledWith(Theme.LIGHT);
    });

    it('should change to dark theme', () => {
      userEvent.click(screen.getByText('appearance'));
      userEvent.click(screen.getByAltText('Dark Theme'));

      expect(mockOnThemeChange).toHaveBeenCalledWith('dark-theme');
    });

    it('should hide', () => {
      userEvent.click(screen.getByTestId('dialogBackdrop'));

      expect(mockOnHide).toHaveBeenCalledTimes(1);
    });
  });
});
