import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Tooltip from '../components/tooltip/Tooltip';

export default {
  title: 'components/Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = () => (
  <span>
    How do you say 'Hello World' in Spanish?
    <Tooltip>Hola Mundo</Tooltip>
  </span>
);

export const Example = Template.bind({});
