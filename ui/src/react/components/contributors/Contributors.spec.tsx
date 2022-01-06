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
import mockAxios from 'axios';

import { Contributor } from '../../types/Contributor';

import Contributors from './Contributors';

const mockContributors: Contributor[] = [
  {
    accountUrl: 'https://github.com/contributor-1',
    image: '/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw',
  },
  {
    accountUrl: 'https://github.com/contributor-2',
    image: '/8j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw',
  },
];

describe('Contributors', () => {
  beforeEach(() => {
    mockAxios.get = jest.fn().mockResolvedValue({ data: mockContributors });
  });

  it('should render contributor images with links to profiles', async () => {
    render(<Contributors />);

    const contributorImage1 = (await screen.findByAltText('https://github.com/contributor-1')) as HTMLImageElement;
    const contributorImage2 = screen.getByAltText('https://github.com/contributor-2') as HTMLImageElement;

    const contributorLink1 = contributorImage1.parentElement as HTMLAnchorElement;
    const contributorLink2 = contributorImage2.parentElement as HTMLAnchorElement;

    expect(contributorImage1.src).toBe('data:image/png;base64,' + mockContributors[0].image);
    expect(contributorImage2.src).toBe('data:image/png;base64,' + mockContributors[1].image);
    expect(contributorLink1.href).toBe(mockContributors[0].accountUrl);
    expect(contributorLink2.href).toBe(mockContributors[1].accountUrl);
  });
});
