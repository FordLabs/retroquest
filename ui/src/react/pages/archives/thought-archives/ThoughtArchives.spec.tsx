import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import ThoughtArchives from './ThoughtArchives';

describe('Thought Archives', () => {
  it('should display Archived Boards List by default', () => {
    render(
      <RecoilRoot>
        <ThoughtArchives />
      </RecoilRoot>
    );
    expect(screen.queryByText('Thought Archives'));
  });
});
