import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import TopHeader from '../components/top-header/TopHeader';

export default {
  title: 'components/TopHeader',
  component: TopHeader,
} as ComponentMeta<typeof TopHeader>;

const Template: ComponentStory<typeof TopHeader> = () => {
  return (
    <MemoryRouter initialEntries={['/team/team-id/']}>
      <TopHeader />
    </MemoryRouter>
  );
};

export const Example = Template.bind({});
