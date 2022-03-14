/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Toast, ToastLevel } from './Toast';

describe('Toast', () => {
  it('should display content passed to Toast', () => {
    render(<Toast title={'That is Unfortunate'}>Something appears to have gone wrong.</Toast>);
    screen.getByText('Something appears to have gone wrong.');
  });

  it('should display title passed to Toast', () => {
    render(<Toast title={'Uh Oh'}>Something appears to have gone wrong.</Toast>);
    screen.getByText('Uh Oh');
  });

  it('should default toast level to error', () => {
    render(<Toast title={'Uh Oh'}>Something appears to have gone wrong.</Toast>);
    expect(document.getElementsByClassName('error')).toHaveLength(1);
  });

  it('should add toast level class', () => {
    createToastWithLevel(ToastLevel.ERROR);
    expect(document.getElementsByClassName('error')).toHaveLength(1);

    createToastWithLevel(ToastLevel.WARNING);
    expect(document.getElementsByClassName('warning')).toHaveLength(1);

    createToastWithLevel(ToastLevel.INFO);
    expect(document.getElementsByClassName('info')).toHaveLength(1);
  });
});

function createToastWithLevel(level: ToastLevel) {
  render(
    <Toast title={'Uh Oh'} toastLevel={level}>
      Something appears to have gone wrong.
    </Toast>
  );
}
