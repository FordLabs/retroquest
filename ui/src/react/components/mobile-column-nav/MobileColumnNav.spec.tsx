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
import React from 'react';
import { render, screen } from '@testing-library/react';

import { mockColumns } from '../../services/api/__mocks__/ColumnService';

import MobileColumnNav from './MobileColumnNav';

const selectedClass = 'selected';

describe.each([
  ['Happy', 0],
  ['Confused', 1],
  ['Sad', 2],
  ['Action Items', 3],
])('Mobile Column Nav', (columnTitle: string, index: number) => {
  it(`should make the "${columnTitle}" column the active column`, () => {
    const setSelectedIndex = jest.fn();
    render(<MobileColumnNav columns={mockColumns} selectedIndex={null} setSelectedIndex={setSelectedIndex} />);
    const columnButton = screen.getByText(columnTitle + ' Column');
    columnButton.click();
    expect(setSelectedIndex).toHaveBeenCalledWith(index);
  });

  it(`should add "selected" class to the ${columnTitle} column button`, () => {
    render(<MobileColumnNav columns={mockColumns} selectedIndex={index} setSelectedIndex={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    buttons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        expect(button.innerHTML).toContain(columnTitle);
        expect(button.getAttribute('class')).toContain(selectedClass);
      } else {
        expect(button.getAttribute('class')).not.toContain(selectedClass);
      }
    });
  });
});
