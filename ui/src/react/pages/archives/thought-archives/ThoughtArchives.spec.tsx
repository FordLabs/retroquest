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
import { RecoilRoot } from 'recoil';

import ThoughtArchives from './ThoughtArchives';

describe('Thought Archives', () => {
  it('should show "No Archives" message when no archived thoughts are present', () => {
    render(
      <RecoilRoot>
        <ThoughtArchives />
      </RecoilRoot>
    );

    screen.getByText('No archives were found.');
    const description = screen.getByTestId('noArchivesFoundSectionDescription');
    expect(description.innerHTML).toBe('Boards will appear when retros are ended with <b>thoughts</b>.');
  });
});
