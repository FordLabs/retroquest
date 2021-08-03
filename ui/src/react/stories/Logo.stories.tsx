import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Logo from '../components/logo/Logo';

export default {
  title: 'components/Logo',
  component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = () => <Logo />;

export const Example = Template.bind({});
