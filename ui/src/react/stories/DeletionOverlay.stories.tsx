import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DeletionOverlay from '../components/deletion-overlay/DeletionOverlay';

export default {
  title: 'components/DeletionOverlay',
  component: DeletionOverlay,
} as ComponentMeta<typeof DeletionOverlay>;

const Template: ComponentStory<typeof DeletionOverlay> = () => {
  const [show, setShow] = React.useState(false);

  const onConfirm = () => {
    alert('deletion confirmed');
    setShow(false);
  };

  const onCancel = () => {
    alert('deletion cancelled');
    setShow(false);
  };

  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexShrink: 1,
      }}
    >
      <span
        style={{
          width: 300,
          height: 100,
          position: 'relative',
        }}
      >
        {show ? (
          <DeletionOverlay header="Delete item?" onConfirm={onConfirm} onCancel={onCancel} />
        ) : (
          <div onClick={() => setShow(true)}>Click to delete</div>
        )}
      </span>
    </span>
  );
};

export const Example = Template.bind({});
