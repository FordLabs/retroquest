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

import InputText from './InputText';
import userEvent from '@testing-library/user-event';

describe('InputText', () => {
  const mockChange = jest.fn();

  it('should render label, value, and validation message', () => {
    render(
      <InputText
        id="sample"
        label="Sample Label"
        value="Sample Value"
        validationMessage="Sample Message"
        onChange={mockChange}
      />
    );

    userEvent.type(screen.getByLabelText('Sample Label'), 'new text');

    screen.getByText('Sample Label');
    screen.getByDisplayValue('Sample Value');
    screen.getByText('Sample Message');

    expect(mockChange).toHaveBeenCalled();
  });

  it('can render as invalid', () => {
    render(
      <InputText
        id="sample"
        label="Sample Label"
        value="Sample Value"
        validationMessage="Sample Message"
        onChange={mockChange}
        invalid={true}
      />
    );

    expect(screen.getByLabelText('Sample Label').parentElement.className).toContain('invalid');
  });
});
