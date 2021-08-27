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

import Form from './Form';
import userEvent from '@testing-library/user-event';

describe('Form', () => {
  it('should display children, error messages, and a submit button', () => {
    const mockSubmit = jest.fn();

    render(
      <Form submitButtonText="custom submit" onSubmit={mockSubmit} errorMessages={['error message1', 'error message2']}>
        children
      </Form>
    );

    userEvent.click(screen.getByText('custom submit'));
    screen.getByText('children');
    screen.getByText('error message1');
    screen.getByText('error message2');

    expect(mockSubmit).toHaveBeenCalled();
  });
});
