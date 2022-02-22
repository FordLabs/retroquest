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
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActionItem from '../components/action-item/ActionItem';

export default {
  title: 'components/ActionItem',
  component: ActionItem,
} as ComponentMeta<typeof ActionItem>;

const testAction = {
  id: 0,
  task: 'Finish this react migration',
  assignee: 'FordLabs',
  completed: false,
  dateCreated: '2021-08-12',
};

const Template: ComponentStory<typeof ActionItem> = () => {
  const [action, setAction] = React.useState(testAction);

  function onAssign(assignee) {
    setAction((oldAction) => ({ ...oldAction, assignee }));
  }

  function onComplete() {
    setAction(({ completed, ...rest }) => ({ ...rest, completed: !completed }));
  }

  function onSelect() {
    alert('action selected');
  }

  return (
    <>
      <div style={{ width: '400px', marginBottom: '20px' }}>
        <ActionItem action={action} onEditAssignee={onAssign} onComplete={onComplete} onSelect={onSelect} />
      </div>
      <div style={{ width: '400px' }}>
        <ActionItem
          readOnly={true}
          action={testAction}
          onEditAssignee={onAssign}
          onComplete={onComplete}
          onSelect={onSelect}
        />
      </div>
    </>
  );
};

export const Example = Template.bind({});
