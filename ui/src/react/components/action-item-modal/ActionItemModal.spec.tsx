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

import ActionItemModal from './ActionItemModal';
import { ModalMethods } from '../modal/Modal';

describe('ActionItemModal', () => {
  const fakeAction = {
    id: 0,
    task: 'fake task',
    assignee: '',
    completed: false,
    dateCreated: '2021-08-12',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as an action item in a modal', () => {
    const ref = React.createRef<ModalMethods>();
    render(<ActionItemModal action={fakeAction} ref={ref} />);

    act(() => {
      ref.current.show();
    });

    screen.getByText('fake task');
    screen.getByText('Aug 12th');
    screen.getByTestId('actionItem');
    screen.getByTestId('modalBackdrop');
  });
});
