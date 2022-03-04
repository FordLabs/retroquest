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

import NotFoundSection from './NotFoundSection';

describe('Not Found Section', () => {
  it('should show subheader and paragraph params', () => {
    const subheader = 'This is a subheader';
    render(
      <NotFoundSection
        paragraph={
          <>
            This is a <span className="bold">paragraph</span>
          </>
        }
        subHeader={subheader}
      />
    );
    expect(screen.getByText('Looks Like A New Team!')).toBeDefined();
    expect(screen.getByText(subheader)).toBeDefined();

    const actualParagraphElement = screen.getByTestId('notFoundSectionDescription');
    expect(actualParagraphElement.innerHTML).toEqual(`This is a <span class="bold">paragraph</span>`);
  });
});
