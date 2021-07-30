import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TextField from '../components/text-field/TextField';

export default {
  title: 'TextField',
  component: TextField,
} as ComponentMeta<typeof TextField>;

const props = {
  placeholder: 'Enter A Thought',
  handleSubmission(string) {
    alert(`Submitting: ${string}`);
  },
};

const Template: ComponentStory<typeof TextField> = () => (
  <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', maxWidth: '800px' }}>
    <TextField {...props} type="happy" />
    <TextField {...props} type="confused" />
    <TextField {...props} type="unhappy" />
    <TextField {...props} type="action" />
  </span>
);

export const TextFieldExample = Template.bind({});
