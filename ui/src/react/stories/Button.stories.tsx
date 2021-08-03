import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PrimaryButton, SecondaryButton } from '../components/button/Button';

export default {
  title: 'components/Button',
  component: PrimaryButton,
} as ComponentMeta<typeof PrimaryButton>;

const ButtonTemplate: ComponentStory<typeof PrimaryButton> = () => (
  <div>
    <PrimaryButton onClick={() => alert('primary button clicked')}>Primary</PrimaryButton>
    <SecondaryButton onClick={() => alert('secondary button clicked')}>Secondary</SecondaryButton>
  </div>
);

export const Example = ButtonTemplate.bind({});
