import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FeedbackDialogRenderer } from '../components/feedback-dialog/FeedbackDialog';

export default {
  title: 'components/FeedbackDialog',
  component: FeedbackDialogRenderer,
} as ComponentMeta<typeof FeedbackDialogRenderer>;

const Template: ComponentStory<typeof FeedbackDialogRenderer> = () => {
  return (
    <FeedbackDialogRenderer
      teamId="team-id"
      onSubmit={(feedback) => alert(`submitting \n ${JSON.stringify(feedback, null, 2)}`)}
      onHide={() => alert('hide dialog')}
    />
  );
};

export const Example = Template.bind({});
