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
import { render, screen } from '@testing-library/react';

import { PrimaryButton, SecondaryButton } from './Button';
import userEvent from '@testing-library/user-event';

const mockOnClick = jest.fn();

describe('Buttons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PrimaryButton', () => {
    it('should render and click', () => {
      render(<PrimaryButton onClick={mockOnClick}>PrimaryButton</PrimaryButton>);
      const primaryButton = screen.getByText('PrimaryButton');

      userEvent.click(primaryButton);

      expect(primaryButton.className).toContain('primary');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('SecondaryButton', () => {
    it('should render and click', () => {
      render(<SecondaryButton onClick={mockOnClick}>SecondaryButton</SecondaryButton>);
      const primaryButton = screen.getByText('SecondaryButton');

      userEvent.click(primaryButton);

      expect(primaryButton.className).toContain('secondary');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
