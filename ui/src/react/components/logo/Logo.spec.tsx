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
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import Logo from './Logo';

describe('Logo', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    ({ container } = render(
      <RecoilRoot>
        <Logo />
      </RecoilRoot>
    ));
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render title and link correctly', () => {
    screen.getByText('RetroQuest');
    expect(screen.getByText('FordLabs').getAttribute('href')).toBe('https://fordlabs.com');
  });
});
